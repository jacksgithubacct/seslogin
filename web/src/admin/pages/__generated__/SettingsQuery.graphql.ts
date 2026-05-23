/**
 * @generated SignedSource<<93f2ac293695bb8a0cafc9fb7f79c931>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SettingsQuery$variables = Record<PropertyKey, never>;
export type SettingsQuery$data = {
  readonly user: {
    readonly emailSummaryLocationIds: ReadonlyArray<string>;
    readonly id: string;
    readonly locations: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
    }>;
    readonly passkeys: ReadonlyArray<{
      readonly createdAt: number;
      readonly id: string;
      readonly lastUsedAt: number | null | undefined;
      readonly name: string;
    }>;
  };
};
export type SettingsQuery = {
  response: SettingsQuery$data;
  variables: SettingsQuery$variables;
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
  "name": "name",
  "storageKey": null
},
v2 = [
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
        "name": "emailSummaryLocationIds",
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
          (v1/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "PasskeyInfo",
        "kind": "LinkedField",
        "name": "passkeys",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "lastUsedAt",
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
    "name": "SettingsQuery",
    "selections": (v2/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SettingsQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "8b95f80b4f801c04fa615385876cf2a9",
    "id": null,
    "metadata": {},
    "name": "SettingsQuery",
    "operationKind": "query",
    "text": "query SettingsQuery {\n  user {\n    id\n    emailSummaryLocationIds\n    locations {\n      id\n      name\n    }\n    passkeys {\n      id\n      name\n      createdAt\n      lastUsedAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6fb2ec37c20753750d9b0fbe4e916aad";

export default node;
