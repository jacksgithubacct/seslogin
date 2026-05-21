/**
 * @generated SignedSource<<1b0b54699077a1def0530a82488ab4d4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ActivityNewQuery$variables = {
  location: string;
};
export type ActivityNewQuery$data = {
  readonly categories: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
  }>;
  readonly location: {
    readonly id: string;
    readonly people: ReadonlyArray<{
      readonly firstName: string;
      readonly id: string;
      readonly lastName: string;
    }>;
  };
};
export type ActivityNewQuery = {
  response: ActivityNewQuery$data;
  variables: ActivityNewQuery$variables;
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
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "Category",
    "kind": "LinkedField",
    "name": "categories",
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
    "name": "ActivityNewQuery",
    "selections": (v2/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ActivityNewQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "285fdaf018cb72a6d2b14f44a6797ca6",
    "id": null,
    "metadata": {},
    "name": "ActivityNewQuery",
    "operationKind": "query",
    "text": "query ActivityNewQuery(\n  $location: ID!\n) {\n  location(id: $location) {\n    id\n    people {\n      id\n      firstName\n      lastName\n    }\n  }\n  categories {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "d6193bb960f3ea61829796fdb8e8325d";

export default node;
