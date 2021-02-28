export const schema = {
    "models": {
        "Board": {
            "name": "Board",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "cards": {
                    "name": "cards",
                    "isArray": true,
                    "type": {
                        "nonModel": "Card"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "hasEnded": {
                    "name": "hasEnded",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Boards",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "CardType": {
            "name": "CardType",
            "values": [
                "ID",
                "BLUE",
                "RED",
                "NEUTRAL",
                "DEATH"
            ]
        }
    },
    "nonModels": {
        "Card": {
            "name": "Card",
            "fields": {
                "NewField": {
                    "name": "NewField",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "value": {
                    "name": "value",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": {
                        "enum": "CardType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "flipped": {
                    "name": "flipped",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                }
            }
        }
    },
    "version": "a1cf56cc125301b68128a01c97e7f135"
};