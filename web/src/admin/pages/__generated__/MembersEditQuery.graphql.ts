/**
 * @generated SignedSource<<de38d0e13c87986ee6474f66da88110f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MembersEditQuery$variables = {
  id: string;
};
export type MembersEditQuery$data = {
  readonly person: {
    readonly firstName: string;
    readonly id: string;
    readonly lastName: string;
    readonly memberNumber: string | null | undefined;
  };
};
export type MembersEditQuery = {
  response: MembersEditQuery$data;
  variables: MembersEditQuery$variables;
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
    "concreteType": "Person",
    "kind": "LinkedField",
    "name": "person",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
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
    "name": "MembersEditQuery",
    "selections": (v1/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MembersEditQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bbadf1b6170b7ac1f1c459a666a5e986",
    "id": null,
    "metadata": {},
    "name": "MembersEditQuery",
    "operationKind": "query",
    "text": "query MembersEditQuery(\n  $id: ID!\n) {\n  person(id: $id) {\n    id\n    firstName\n    lastName\n    memberNumber\n  }\n}\n"
  }
};
})();

(node as any).hash = "a60f75541008ef2100d2a2c765a883e4";

export default node;
