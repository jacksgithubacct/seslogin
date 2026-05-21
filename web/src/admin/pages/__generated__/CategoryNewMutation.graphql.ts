/**
 * @generated SignedSource<<b5c926d3d7c37f8d42fd7d1be9f3e149>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CategoryNewMutation$variables = {
  name: string;
  nitcGroupId?: string | null | undefined;
  nitcParticipantType?: string | null | undefined;
};
export type CategoryNewMutation$data = {
  readonly createCategory: {
    readonly id: string;
    readonly name: string;
  };
};
export type CategoryNewMutation = {
  response: CategoryNewMutation$data;
  variables: CategoryNewMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "nitcGroupId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "nitcParticipantType"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
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
    "name": "createCategory",
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
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CategoryNewMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CategoryNewMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f1881f103a97e47dfc432b87c6d88018",
    "id": null,
    "metadata": {},
    "name": "CategoryNewMutation",
    "operationKind": "mutation",
    "text": "mutation CategoryNewMutation(\n  $name: String!\n  $nitcGroupId: String\n  $nitcParticipantType: String\n) {\n  createCategory(name: $name, nitcGroupId: $nitcGroupId, nitcParticipantType: $nitcParticipantType) {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "51392ff5d3e1fda0a2720f308304f15a";

export default node;
