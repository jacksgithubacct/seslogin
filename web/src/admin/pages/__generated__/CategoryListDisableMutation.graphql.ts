/**
 * @generated SignedSource<<b278e33c643c8e8d0e05dc1c8b17ac73>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CategoryListDisableMutation$variables = {
  id: string;
  name: string;
  nitcGroupId?: string | null | undefined;
  nitcParticipantType?: string | null | undefined;
};
export type CategoryListDisableMutation$data = {
  readonly updateCategory: {
    readonly enabled: boolean;
    readonly id: string;
    readonly name: string;
  };
};
export type CategoryListDisableMutation = {
  response: CategoryListDisableMutation$data;
  variables: CategoryListDisableMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
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
        "kind": "Literal",
        "name": "enabled",
        "value": false
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
    "name": "CategoryListDisableMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CategoryListDisableMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "350b5e9eef26a932666d27684811ac48",
    "id": null,
    "metadata": {},
    "name": "CategoryListDisableMutation",
    "operationKind": "mutation",
    "text": "mutation CategoryListDisableMutation(\n  $id: ID!\n  $name: String!\n  $nitcGroupId: String\n  $nitcParticipantType: String\n) {\n  updateCategory(id: $id, name: $name, enabled: false, nitcGroupId: $nitcGroupId, nitcParticipantType: $nitcParticipantType) {\n    id\n    name\n    enabled\n  }\n}\n"
  }
};
})();

(node as any).hash = "dfb48106740e4e7a85650c1d6baca887";

export default node;
