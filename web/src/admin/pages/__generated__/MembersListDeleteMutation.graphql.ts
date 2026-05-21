/**
 * @generated SignedSource<<a29d1b264a3776a31d3c92f7d33e4b2b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MembersListDeleteMutation$variables = {
  id: string;
};
export type MembersListDeleteMutation$data = {
  readonly deletePerson: boolean;
};
export type MembersListDeleteMutation = {
  response: MembersListDeleteMutation$data;
  variables: MembersListDeleteMutation$variables;
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
    "name": "deletePerson",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MembersListDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MembersListDeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "991a281b5bb491c2f88ac5150c82e2b4",
    "id": null,
    "metadata": {},
    "name": "MembersListDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation MembersListDeleteMutation(\n  $id: ID!\n) {\n  deletePerson(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "22bfbe755b2e9d7d8156ba720ad49042";

export default node;
