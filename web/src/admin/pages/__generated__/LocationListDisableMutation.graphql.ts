/**
 * @generated SignedSource<<9423a971737e9acec45b61d5dee98e6c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LocationListDisableMutation$variables = {
  id: string;
  name: string;
  nitcEnabled?: number | null | undefined;
};
export type LocationListDisableMutation$data = {
  readonly updateLocation: {
    readonly enabled: boolean;
    readonly id: string;
    readonly name: string;
    readonly nitcEnabled: number | null | undefined;
  };
};
export type LocationListDisableMutation = {
  response: LocationListDisableMutation$data;
  variables: LocationListDisableMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "nitcEnabled"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "enabled",
        "value": false
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LocationListDisableMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LocationListDisableMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e3b44147021b2e8178d19d28d73ab6ab",
    "id": null,
    "metadata": {},
    "name": "LocationListDisableMutation",
    "operationKind": "mutation",
    "text": "mutation LocationListDisableMutation(\n  $id: ID!\n  $name: String!\n  $nitcEnabled: Int\n) {\n  updateLocation(id: $id, name: $name, enabled: false, nitcEnabled: $nitcEnabled) {\n    id\n    name\n    enabled\n    nitcEnabled\n  }\n}\n"
  }
};
})();

(node as any).hash = "c6cbd1d3327f1e106fb8dfded8384ac7";

export default node;
