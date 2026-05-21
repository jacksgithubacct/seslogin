/**
 * @generated SignedSource<<0cec14b6903f73568a4edf1499f27901>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LocationList_item$data = {
  readonly enabled: boolean;
  readonly id: string;
  readonly lastSuccessfulMemberSync: number | null | undefined;
  readonly name: string;
  readonly nitcEnabled: number | null | undefined;
  readonly " $fragmentType": "LocationList_item";
};
export type LocationList_item$key = {
  readonly " $data"?: LocationList_item$data;
  readonly " $fragmentSpreads": FragmentRefs<"LocationList_item">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LocationList_item",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "enabled",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "nitcEnabled",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lastSuccessfulMemberSync",
      "storageKey": null
    }
  ],
  "type": "Location",
  "abstractKey": null
};

(node as any).hash = "8fb382df3874c6835737c80365ec3d5e";

export default node;
