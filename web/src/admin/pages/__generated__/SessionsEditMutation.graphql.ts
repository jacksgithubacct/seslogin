/**
 * @generated SignedSource<<1e9261d4cbfa0a45f51e503ab4e856ec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SessionsEditMutation$variables = {
  config?: string | null | undefined;
  healthcheckUrl?: string | null | undefined;
  id: string;
  name: string;
};
export type SessionsEditMutation$data = {
  readonly updateSession: {
    readonly __typename: "Session";
  };
};
export type SessionsEditMutation = {
  response: SessionsEditMutation$data;
  variables: SessionsEditMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "config"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "healthcheckUrl"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v4 = [
  {
    "kind": "Variable",
    "name": "config",
    "variableName": "config"
  },
  {
    "kind": "Variable",
    "name": "healthcheckUrl",
    "variableName": "healthcheckUrl"
  },
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  },
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SessionsEditMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "Session",
        "kind": "LinkedField",
        "name": "updateSession",
        "plural": false,
        "selections": [
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "SessionsEditMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "Session",
        "kind": "LinkedField",
        "name": "updateSession",
        "plural": false,
        "selections": [
          (v5/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "1d21e9205ffc84e59015e7064a72b136",
    "id": null,
    "metadata": {},
    "name": "SessionsEditMutation",
    "operationKind": "mutation",
    "text": "mutation SessionsEditMutation(\n  $id: ID!\n  $name: String!\n  $config: String\n  $healthcheckUrl: String\n) {\n  updateSession(id: $id, name: $name, config: $config, healthcheckUrl: $healthcheckUrl) {\n    __typename\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "10b16b1f99c4a6b6a7db9dc5d61867f6";

export default node;
