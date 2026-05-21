/**
 * @generated SignedSource<<31f53f6b8972285f75d464c939f0ba67>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ActivityNewMutation$variables = {
  categoryId: string;
  endTime: number;
  locationId: string;
  personId: string;
  startTime: number;
};
export type ActivityNewMutation$data = {
  readonly createPeriod: {
    readonly id: string;
  };
};
export type ActivityNewMutation = {
  response: ActivityNewMutation$data;
  variables: ActivityNewMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "categoryId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "endTime"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "locationId"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "personId"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "startTime"
},
v5 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "categoryId",
        "variableName": "categoryId"
      },
      {
        "kind": "Variable",
        "name": "endTime",
        "variableName": "endTime"
      },
      {
        "kind": "Variable",
        "name": "locationId",
        "variableName": "locationId"
      },
      {
        "kind": "Variable",
        "name": "personId",
        "variableName": "personId"
      },
      {
        "kind": "Variable",
        "name": "startTime",
        "variableName": "startTime"
      }
    ],
    "concreteType": "Period",
    "kind": "LinkedField",
    "name": "createPeriod",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ActivityNewMutation",
    "selections": (v5/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v3/*: any*/),
      (v2/*: any*/),
      (v4/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ActivityNewMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "a5513616aadd98fc8cac8368d0704750",
    "id": null,
    "metadata": {},
    "name": "ActivityNewMutation",
    "operationKind": "mutation",
    "text": "mutation ActivityNewMutation(\n  $personId: ID!\n  $locationId: ID!\n  $startTime: Int!\n  $endTime: Int!\n  $categoryId: ID!\n) {\n  createPeriod(personId: $personId, locationId: $locationId, categoryId: $categoryId, startTime: $startTime, endTime: $endTime) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "eb8fdd1c740976438c57b3674e17bb9f";

export default node;
