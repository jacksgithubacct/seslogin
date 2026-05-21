/**
 * @generated SignedSource<<9d7604c27466c9b1ed853927f0953a58>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ActivityEditQuery$variables = {
  id: string;
};
export type ActivityEditQuery$data = {
  readonly categories: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
  }>;
  readonly period: {
    readonly category: {
      readonly id: string;
      readonly name: string;
    } | null | undefined;
    readonly endTime: number | null | undefined;
    readonly id: string;
    readonly startTime: number;
  };
};
export type ActivityEditQuery = {
  response: ActivityEditQuery$data;
  variables: ActivityEditQuery$variables;
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
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Period",
    "kind": "LinkedField",
    "name": "period",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "startTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Category",
        "kind": "LinkedField",
        "name": "category",
        "plural": false,
        "selections": (v2/*: any*/),
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
    "selections": (v2/*: any*/),
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ActivityEditQuery",
    "selections": (v3/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ActivityEditQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "6eaffb1cea65b50dfb188467a208aae2",
    "id": null,
    "metadata": {},
    "name": "ActivityEditQuery",
    "operationKind": "query",
    "text": "query ActivityEditQuery(\n  $id: ID!\n) {\n  period(id: $id) {\n    id\n    startTime\n    endTime\n    category {\n      id\n      name\n    }\n  }\n  categories {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "d6003f47a55c56f87add0d90458dbe5d";

export default node;
