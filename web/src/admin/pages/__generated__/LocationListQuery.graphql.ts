/**
 * @generated SignedSource<<e63dfe5dd17f4c552d8f9ea8a977595e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LocationListQuery$variables = Record<PropertyKey, never>;
export type LocationListQuery$data = {
  readonly locations: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly " $fragmentSpreads": FragmentRefs<"LocationList_item">;
  }>;
};
export type LocationListQuery = {
  response: LocationListQuery$data;
  variables: LocationListQuery$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LocationListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Location",
        "kind": "LinkedField",
        "name": "locations",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "LocationList_item"
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
    "name": "LocationListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Location",
        "kind": "LinkedField",
        "name": "locations",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e63a3943d79dab56b60e174e8280dff7",
    "id": null,
    "metadata": {},
    "name": "LocationListQuery",
    "operationKind": "query",
    "text": "query LocationListQuery {\n  locations {\n    id\n    name\n    ...LocationList_item\n  }\n}\n\nfragment LocationList_item on Location {\n  id\n  name\n  enabled\n  nitcEnabled\n  lastSuccessfulMemberSync\n}\n"
  }
};
})();

(node as any).hash = "fa11e97ce1d9ee533e68d19184bd58dc";

export default node;
