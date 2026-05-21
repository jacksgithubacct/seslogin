/**
 * @generated SignedSource<<734c487d8b274261e15f1bdc5afacaa1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ActivityListTableDeleteMutation$variables = {
  id: string;
};
export type ActivityListTableDeleteMutation$data = {
  readonly deletePeriod: boolean;
};
export type ActivityListTableDeleteMutation = {
  response: ActivityListTableDeleteMutation$data;
  variables: ActivityListTableDeleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "kind": "ScalarField",
    "name": "deletePeriod",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ActivityListTableDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ActivityListTableDeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d8ac471ecea213f499ac781cb573ada5",
    "id": null,
    "metadata": {},
    "name": "ActivityListTableDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation ActivityListTableDeleteMutation(\n  $id: ID!\n) {\n  deletePeriod(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "68f471864a5602ab13503a1620c337fe";

export default node;
