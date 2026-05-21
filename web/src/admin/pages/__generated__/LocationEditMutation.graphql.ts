/**
 * @generated SignedSource<<4df7d1e80d419f82ab10e4f47141a02f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LocationEditMutation$variables = {
  enabled: boolean;
  id: string;
  name: string;
  nitcEnabled?: number | null | undefined;
};
export type LocationEditMutation$data = {
  readonly updateLocation: {
    readonly enabled: boolean;
    readonly id: string;
    readonly name: string;
    readonly nitcEnabled: number | null | undefined;
  };
};
export type LocationEditMutation = {
  response: LocationEditMutation$data;
  variables: LocationEditMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "enabled"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "nitcEnabled"
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "enabled",
        "variableName": "enabled"
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
      },
      {
        "kind": "Variable",
        "name": "nitcEnabled",
        "variableName": "nitcEnabled"
      }
    ],
    "concreteType": "Location",
    "kind": "LinkedField",
    "name": "updateLocation",
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
        "name": "name",
        "storageKey": null
      },
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
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "LocationEditMutation",
    "selections": (v4/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "LocationEditMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "821a77c0e39cc681eb80d76c8d2b8172",
    "id": null,
    "metadata": {},
    "name": "LocationEditMutation",
    "operationKind": "mutation",
    "text": "mutation LocationEditMutation(\n  $id: ID!\n  $name: String!\n  $enabled: Boolean!\n  $nitcEnabled: Int\n) {\n  updateLocation(id: $id, name: $name, enabled: $enabled, nitcEnabled: $nitcEnabled) {\n    id\n    name\n    enabled\n    nitcEnabled\n  }\n}\n"
  }
};
})();

(node as any).hash = "868af79946c11959988de9c99d4975f6";

export default node;
