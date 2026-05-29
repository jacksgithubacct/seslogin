/**
 * @generated SignedSource<<73d9ec063f5a6b196421cf1ae581c655>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UserInfoProviderQuery$variables = Record<PropertyKey, never>;
export type UserInfoProviderQuery$data = {
  readonly user: {
    readonly email: string;
    readonly id: string;
    readonly isDev: boolean;
    readonly isSuper: boolean;
    readonly locations: ReadonlyArray<{
      readonly enabled: boolean;
      readonly id: string;
      readonly name: string;
    }>;
  };
};
export type UserInfoProviderQuery = {
  response: UserInfoProviderQuery$data;
  variables: UserInfoProviderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "user",
    "plural": false,
    "selections": [
      (v0/*: any*/),
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "UserInfoProviderQuery",
    "selections": (v1/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UserInfoProviderQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2fd93edaca32df1a110f3bd9f94ba1eb",
    "id": null,
    "metadata": {},
    "name": "UserInfoProviderQuery",
    "operationKind": "query",
    "text": "query UserInfoProviderQuery {\n  user {\n    id\n    email\n    isSuper\n    isDev\n    locations {\n      id\n      name\n      enabled\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f1286e78b81fe912eb009d80e4d58383";

export default node;
