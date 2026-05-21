/**
 * @generated SignedSource<<85743133ca92784474871f8762f525a3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UserListQuery$variables = Record<PropertyKey, never>;
export type UserListQuery$data = {
  readonly users: ReadonlyArray<{
    readonly accessTime: number | null | undefined;
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"UserList_user">;
  }>;
};
export type UserListQuery = {
  response: UserListQuery$data;
  variables: UserListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accessTime",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "UserListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "users",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "UserList_user"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UserListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "users",
        "plural": true,
        "selections": [
          (v0/*: any*/),
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
            "concreteType": "Location",
            "kind": "LinkedField",
            "name": "locations",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "deleted",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "97b1dd221296c705fbf8086a72f3259e",
    "id": null,
    "metadata": {},
    "name": "UserListQuery",
    "operationKind": "query",
    "text": "query UserListQuery {\n  users {\n    id\n    accessTime\n    ...UserList_user\n  }\n}\n\nfragment UserList_user on User {\n  id\n  email\n  accessTime\n  isSuper\n  locations {\n    id\n    name\n  }\n  deleted\n}\n"
  }
};
})();

(node as any).hash = "1a693aaaf6e1865a84560f867d3ea352";

export default node;
