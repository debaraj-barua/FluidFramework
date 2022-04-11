/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-validator in @fluidframework/build-tools.
 */
/* eslint-disable max-lines */
import * as old from "@fluidframework/datastore-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "EnumDeclaration_DataStoreMessageType": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_DataStoreMessageType():
    TypeOnly<old.DataStoreMessageType>;
declare function use_current_EnumDeclaration_DataStoreMessageType(
    use: TypeOnly<current.DataStoreMessageType>);
use_current_EnumDeclaration_DataStoreMessageType(
    get_old_EnumDeclaration_DataStoreMessageType());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "EnumDeclaration_DataStoreMessageType": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_DataStoreMessageType():
    TypeOnly<current.DataStoreMessageType>;
declare function use_old_EnumDeclaration_DataStoreMessageType(
    use: TypeOnly<old.DataStoreMessageType>);
use_old_EnumDeclaration_DataStoreMessageType(
    get_current_EnumDeclaration_DataStoreMessageType());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "ClassDeclaration_FluidDataStoreRuntime": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_FluidDataStoreRuntime():
    TypeOnly<old.FluidDataStoreRuntime>;
declare function use_current_ClassDeclaration_FluidDataStoreRuntime(
    use: TypeOnly<current.FluidDataStoreRuntime>);
use_current_ClassDeclaration_FluidDataStoreRuntime(
    get_old_ClassDeclaration_FluidDataStoreRuntime());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "ClassDeclaration_FluidDataStoreRuntime": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_FluidDataStoreRuntime():
    TypeOnly<current.FluidDataStoreRuntime>;
declare function use_old_ClassDeclaration_FluidDataStoreRuntime(
    use: TypeOnly<old.FluidDataStoreRuntime>);
use_old_ClassDeclaration_FluidDataStoreRuntime(
    get_current_ClassDeclaration_FluidDataStoreRuntime());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "ClassDeclaration_FluidObjectHandle": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_FluidObjectHandle():
    TypeOnly<old.FluidObjectHandle>;
declare function use_current_ClassDeclaration_FluidObjectHandle(
    use: TypeOnly<current.FluidObjectHandle>);
use_current_ClassDeclaration_FluidObjectHandle(
    get_old_ClassDeclaration_FluidObjectHandle());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "ClassDeclaration_FluidObjectHandle": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_FluidObjectHandle():
    TypeOnly<current.FluidObjectHandle>;
declare function use_old_ClassDeclaration_FluidObjectHandle(
    use: TypeOnly<old.FluidObjectHandle>);
use_old_ClassDeclaration_FluidObjectHandle(
    get_current_ClassDeclaration_FluidObjectHandle());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ISharedObjectRegistry": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ISharedObjectRegistry():
    TypeOnly<old.ISharedObjectRegistry>;
declare function use_current_InterfaceDeclaration_ISharedObjectRegistry(
    use: TypeOnly<current.ISharedObjectRegistry>);
use_current_InterfaceDeclaration_ISharedObjectRegistry(
    get_old_InterfaceDeclaration_ISharedObjectRegistry());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ISharedObjectRegistry": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ISharedObjectRegistry():
    TypeOnly<current.ISharedObjectRegistry>;
declare function use_old_InterfaceDeclaration_ISharedObjectRegistry(
    use: TypeOnly<old.ISharedObjectRegistry>);
use_old_InterfaceDeclaration_ISharedObjectRegistry(
    get_current_InterfaceDeclaration_ISharedObjectRegistry());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "VariableDeclaration_mixinRequestHandler": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_mixinRequestHandler():
    TypeOnly<typeof old.mixinRequestHandler>;
declare function use_current_VariableDeclaration_mixinRequestHandler(
    use: TypeOnly<typeof current.mixinRequestHandler>);
use_current_VariableDeclaration_mixinRequestHandler(
    get_old_VariableDeclaration_mixinRequestHandler());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "VariableDeclaration_mixinRequestHandler": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_mixinRequestHandler():
    TypeOnly<typeof current.mixinRequestHandler>;
declare function use_old_VariableDeclaration_mixinRequestHandler(
    use: TypeOnly<typeof old.mixinRequestHandler>);
use_old_VariableDeclaration_mixinRequestHandler(
    get_current_VariableDeclaration_mixinRequestHandler());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "VariableDeclaration_mixinSummaryHandler": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_mixinSummaryHandler():
    TypeOnly<typeof old.mixinSummaryHandler>;
declare function use_current_VariableDeclaration_mixinSummaryHandler(
    use: TypeOnly<typeof current.mixinSummaryHandler>);
use_current_VariableDeclaration_mixinSummaryHandler(
    get_old_VariableDeclaration_mixinSummaryHandler());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "VariableDeclaration_mixinSummaryHandler": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_mixinSummaryHandler():
    TypeOnly<typeof current.mixinSummaryHandler>;
declare function use_old_VariableDeclaration_mixinSummaryHandler(
    use: TypeOnly<typeof old.mixinSummaryHandler>);
use_old_VariableDeclaration_mixinSummaryHandler(
    get_current_VariableDeclaration_mixinSummaryHandler());
