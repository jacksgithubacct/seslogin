#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.11"
# dependencies = ["boto3", "awscrt", "python-dotenv"]
# ///
"""
Check or update the seslogin-terraform IAM policy from seslogin-dev-policy.json.tftpl.

Default: compare deployed policy against the local tftpl (dry-run).
--update: push a new default policy version.

Reads SESLOGIN_TERRAFORM_POLICY_ARN from ../.env.secret (relative to this script).
"""

import argparse
import json
import os
import sys
from pathlib import Path

import boto3
from dotenv import load_dotenv

TFTPL = Path(__file__).parent / "seslogin-dev-policy.json.tftpl"
MAX_VERSIONS = 5

load_dotenv(Path(__file__).parent.parent / ".env.secret")
POLICY_ARN = os.environ.get("SESLOGIN_TERRAFORM_POLICY_ARN")
if not POLICY_ARN:
    print("ERROR: SESLOGIN_TERRAFORM_POLICY_ARN not set in .env.secret")
    sys.exit(1)


def render(account_id: str) -> dict:
    text = TFTPL.read_text().replace("${account_id}", account_id)
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"ERROR: rendered tftpl is not valid JSON: {e}")
        sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--update", action="store_true", help="push a new policy version")
    args = parser.parse_args()

    iam = boto3.client("iam")
    account_id = boto3.client("sts").get_caller_identity()["Account"]

    local = render(account_id)

    versions = iam.list_policy_versions(PolicyArn=POLICY_ARN)["Versions"]
    default_version = next(v for v in versions if v["IsDefaultVersion"])
    deployed_doc = iam.get_policy_version(
        PolicyArn=POLICY_ARN, VersionId=default_version["VersionId"]
    )["PolicyVersion"]["Document"]

    local_text = json.dumps(local, sort_keys=True, indent=2)
    deployed_text = json.dumps(deployed_doc, sort_keys=True, indent=2)

    if local_text == deployed_text:
        print(f"In sync — deployed version is {default_version['VersionId']} and matches local tftpl.")
        return

    print(f"OUT OF SYNC — deployed version is {default_version['VersionId']}.")
    print()

    local_stmts = {s["Sid"]: set(s.get("Action", [])) for s in local["Statement"] if "Sid" in s}
    deployed_stmts = {s["Sid"]: set(s.get("Action", [])) for s in deployed_doc["Statement"] if "Sid" in s}
    all_sids = sorted(local_stmts.keys() | deployed_stmts.keys())
    for sid in all_sids:
        added = local_stmts.get(sid, set()) - deployed_stmts.get(sid, set())
        removed = deployed_stmts.get(sid, set()) - local_stmts.get(sid, set())
        if added:
            print(f"  {sid}: + {sorted(added)}")
        if removed:
            print(f"  {sid}: - {sorted(removed)}")
    if local_stmts.keys() - deployed_stmts.keys():
        print(f"  New statements: {sorted(local_stmts.keys() - deployed_stmts.keys())}")
    if deployed_stmts.keys() - local_stmts.keys():
        print(f"  Removed statements: {sorted(deployed_stmts.keys() - local_stmts.keys())}")

    if not args.update:
        print()
        print("Re-run with --update to push.")
        return

    if len(versions) >= MAX_VERSIONS:
        non_default = sorted(
            [v for v in versions if not v["IsDefaultVersion"]],
            key=lambda v: v["CreateDate"],
        )
        if not non_default:
            print("ERROR: at version limit and all versions are default — cannot proceed")
            sys.exit(1)
        oldest = non_default[0]
        print(f"At version limit — deleting {oldest['VersionId']}")
        iam.delete_policy_version(PolicyArn=POLICY_ARN, VersionId=oldest["VersionId"])

    result = iam.create_policy_version(
        PolicyArn=POLICY_ARN,
        PolicyDocument=json.dumps(local),
        SetAsDefault=True,
    )
    new_version = result["PolicyVersion"]["VersionId"]
    print(f"Pushed {new_version} as default.")
    print("NOTE: IAM changes can take a few minutes to propagate — wait before assuming Terraform is still failing.")


if __name__ == "__main__":
    main()
