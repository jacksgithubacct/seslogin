/**
 * @generated SignedSource<<60d1e9c9755f9fd9766f8932e6913b25>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MembersListQuery$variables = {
  location: string;
};
export type MembersListQuery$data = {
  readonly location: {
    readonly id: string;
    readonly lastSuccessfulMemberSync: number | null | undefined;
    readonly people: ReadonlyArray<{
      readonly firstName: string;
      readonly id: string;
      readonly lastName: string;
      readonly memberNumber: string | null | undefined;
      readonly sesApiPersonId: string | null | undefined;
    }>;
    readonly sesApiHeadquartersId: string | null | undefined;
  };
};
export type MembersListQuery = {
  response: MembersListQuery$data;
  variables: MembersListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "location"
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
        "variableName": "location"
      }
    ],
    "concreteType": "Location",
    "kind": "LinkedField",
    "name": "location",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "sesApiHeadquartersId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastSuccessfulMemberSync",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "people",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "firstName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "lastName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "memberNumber",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "sesApiPersonId",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MembersListQuery",
    "selections": (v2/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MembersListQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d87bebb350363ebef658f704d0829007",
    "id": null,
    "metadata": {},
    "name": "MembersListQuery",
    "operationKind": "query",
    "text": "query MembersListQuery(\n  $location: ID!\n) {\n  location(id: $location) {\n    id\n    sesApiHeadquartersId\n    lastSuccessfulMemberSync\n    people {\n      id\n      firstName\n      lastName\n      memberNumber\n      sesApiPersonId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d0cd7a45b1753a6c3df6338ceaed1a59";

export default node;
