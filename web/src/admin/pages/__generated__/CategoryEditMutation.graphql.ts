/**
 * @generated SignedSource<<a0caa638dbd6d462e41d616bcd453340>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CategoryEditMutation$variables = {
  enabled: boolean;
  id: string;
  name: string;
  nitcGroupId?: string | null | undefined;
  nitcParticipantType?: string | null | undefined;
};
export type CategoryEditMutation$data = {
  readonly updateCategory: {
    readonly enabled: boolean;
    readonly id: string;
    readonly name: string;
    readonly nitcGroupId: string | null | undefined;
    readonly nitcParticipantType: string | null | undefined;
  };
};
export type CategoryEditMutation = {
  response: CategoryEditMutation$data;
  variables: CategoryEditMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "enabled"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "nitcGroupId"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "nitcParticipantType"
},
v5 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "enabled",
        "variableName": "enabled"
      },
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "nitcGroupId",
        "variableName": "nitcGroupId"
      },
      {
        "kind": "Variable",
        "name": "nitcParticipantType",
        "variableName": "nitcParticipantType"
      }
    ],
    "concreteType": "Category",
    "kind": "LinkedField",
    "name": "updateCategory",
    "plural": false,
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
        "name": "nitcGroupId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "nitcParticipantType",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CategoryEditMutation",
    "selections": (v5/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Operation",
    "name": "CategoryEditMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "521c91f0c9898d7f354e0c77fc9157de",
    "id": null,
    "metadata": {},
    "name": "CategoryEditMutation",
    "operationKind": "mutation",
    "text": "mutation CategoryEditMutation(\n  $id: ID!\n  $name: String!\n  $enabled: Boolean!\n  $nitcGroupId: String\n  $nitcParticipantType: String\n) {\n  updateCategory(id: $id, name: $name, enabled: $enabled, nitcGroupId: $nitcGroupId, nitcParticipantType: $nitcParticipantType) {\n    id\n    name\n    enabled\n    nitcGroupId\n    nitcParticipantType\n  }\n}\n"
  }
};
})();

(node as any).hash = "d29077404ae530c4e5ba09c9790e7dcb";

export default node;
