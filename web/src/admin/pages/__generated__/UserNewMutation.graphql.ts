/**
 * @generated SignedSource<<68ccb470e3c2dd844c777cb69317026e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UserNewMutation$variables = {
  email: string;
  isSuper: boolean;
  locationGrants: ReadonlyArray<string>;
};
export type UserNewMutation$data = {
  readonly createUser: {
    readonly email: string;
    readonly id: string;
  };
};
export type UserNewMutation = {
  response: UserNewMutation$data;
  variables: UserNewMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "isSuper"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "locationGrants"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "isSuper",
        "variableName": "isSuper"
      },
      {
        "kind": "Variable",
        "name": "locationGrants",
        "variableName": "locationGrants"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "createUser",
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
        "name": "email",
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
    "name": "UserNewMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UserNewMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e03e9e49f0e3d4258293319f02c7a97a",
    "id": null,
    "metadata": {},
    "name": "UserNewMutation",
    "operationKind": "mutation",
    "text": "mutation UserNewMutation(\n  $email: String!\n  $isSuper: Boolean!\n  $locationGrants: [String!]!\n) {\n  createUser(email: $email, isSuper: $isSuper, locationGrants: $locationGrants) {\n    id\n    email\n  }\n}\n"
  }
};
})();

(node as any).hash = "98899e77c398636555cce92654415dcf";

export default node;
