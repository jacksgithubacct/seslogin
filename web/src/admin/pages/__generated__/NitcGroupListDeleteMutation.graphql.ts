/**
 * @generated SignedSource<<92e46f994a43ec495e15ea3e57e97ee3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type NitcGroupListDeleteMutation$variables = {
  id: string;
};
export type NitcGroupListDeleteMutation$data = {
  readonly deleteNitcGroup: boolean;
};
export type NitcGroupListDeleteMutation = {
  response: NitcGroupListDeleteMutation$data;
  variables: NitcGroupListDeleteMutation$variables;
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
    "name": "deleteNitcGroup",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NitcGroupListDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NitcGroupListDeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "caaf37b486329fa43ed7afff43c4c4cb",
    "id": null,
    "metadata": {},
    "name": "NitcGroupListDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation NitcGroupListDeleteMutation(\n  $id: ID!\n) {\n  deleteNitcGroup(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "5a9fe95484bee73ae64607fd6c44b80b";

export default node;
