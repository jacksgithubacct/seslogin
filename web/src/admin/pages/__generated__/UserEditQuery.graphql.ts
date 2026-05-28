/**
 * @generated SignedSource<<8dec900aa4d31e6fe85bd8ba21cd15a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UserEditQuery$variables = {
  id: string;
};
export type UserEditQuery$data = {
  readonly locations: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
  }>;
  readonly user: {
    readonly email: string | null | undefined;
    readonly id: string;
    readonly isDev: boolean;
    readonly isSuper: boolean;
    readonly locationGrantIds: ReadonlyArray<string>;
  };
};
export type UserEditQuery = {
  response: UserEditQuery$data;
  variables: UserEditQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "user",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isSuper",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isDev",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "locationGrantIds",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "Location",
    "kind": "LinkedField",
    "name": "locations",
    "plural": true,
    "selections": [
      (v1/*: any*/),
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
    "name": "UserEditQuery",
    "selections": (v2/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UserEditQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "56c66f88bf008a31a023c9eb5b66e289",
    "id": null,
    "metadata": {},
    "name": "UserEditQuery",
    "operationKind": "query",
    "text": "query UserEditQuery(\n  $id: ID!\n) {\n  user(id: $id) {\n    id\n    email\n    isSuper\n    isDev\n    locationGrantIds\n  }\n  locations {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "08a7f6e79ad0bd32c34e5e23efc862f6";

export default node;
