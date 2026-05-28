/**
 * @generated SignedSource<<b58a76d7d144d6e0bd279dd124a9cfe4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UserEditMutation$variables = {
  deleted: boolean;
  email: string;
  id: string;
  isDev: boolean;
  isSuper: boolean;
  locationGrants: ReadonlyArray<string>;
};
export type UserEditMutation$data = {
  readonly updateUser: {
    readonly email: string | null | undefined;
    readonly id: string;
    readonly isDev: boolean;
    readonly isSuper: boolean;
    readonly locationGrantIds: ReadonlyArray<string>;
  };
};
export type UserEditMutation = {
  response: UserEditMutation$data;
  variables: UserEditMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "deleted"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isDev"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isSuper"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "locationGrants"
},
v6 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "deleted",
        "variableName": "deleted"
      },
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "isDev",
        "variableName": "isDev"
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
    "name": "updateUser",
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isSuper",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isDev",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "locationGrantIds",
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
      (v4/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UserEditMutation",
    "selections": (v6/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/),
      (v5/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "UserEditMutation",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "90fef54871b0d9dcb46725db99837a2c",
    "id": null,
    "metadata": {},
    "name": "UserEditMutation",
    "operationKind": "mutation",
    "text": "mutation UserEditMutation(\n  $id: ID!\n  $email: String!\n  $isSuper: Boolean!\n  $isDev: Boolean!\n  $locationGrants: [String!]!\n  $deleted: Boolean!\n) {\n  updateUser(id: $id, email: $email, isSuper: $isSuper, isDev: $isDev, locationGrants: $locationGrants, deleted: $deleted) {\n    id\n    email\n    isSuper\n    isDev\n    locationGrantIds\n  }\n}\n"
  }
};
})();

(node as any).hash = "0787bc375c0dd917e0d9b7e8dc5bf1ce";

export default node;
