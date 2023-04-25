---
title: Interface with conditional properties in TypeScript
published: true
description: 
date: 2023-04-19
---

# How to Define an Interface with conditional properties in TypeScript

TypeScript is a popular programming language that provides optional static typing, making it easier to catch and prevent errors before runtime. One of TypeScript's most powerful features is its support for interfaces, which define the shape of objects and ensure that they conform to a specific structure. Let's explore how to define an interface with conditional properties in TypeScript. We'll use a specific example to demonstrate this concept.

Suppose we have an object with several properties, including `name`, `value`, `groupId`, `groupName`, and `inherited` boolean flag. The name and value properties are always present, but the `groupId` and `groupName` properties depend on the `inherited` flag. If `inherited` is true, then `groupId` and `groupName` must be present and of type `string`. Otherwise, both properties should be `null`.

## Easy but incorrect

You can define an interface for your object as follows:

```typescript
interface MyObject {
  name: string;
  value: string;
  groupId: string | null;
  groupName: string | null;
  inherited: boolean;
}
```
In this interface, `name` and `value` are always present and of type `string`. The `groupId` and `groupName` properties can be either a `string` or `null`, depending on whether `inherited` is `true` or `false`. Technically this should work because with this interface, you can create objects that conform to this structure, like so:

```typescript
const myObject: MyObject = {
  name: "myName",
  value: "myValue",
  groupId: null,
  groupName: null,
  inherited: false,
};
```

Or, if `inherited` is `true`:

```typescript
const myInheritedObject: MyObject = {
  name: "myName",
  value: "myValue",
  groupId: "myGroupId",
  groupName: "myGroupName",
  inherited: true,
};
```

However this is not correct as this interface allows me to create object like this:

```typescript
const myInheritedObject: MyObject = {
  name: "myName",
  value: "myValue",
  groupId: null,
  groupName: null,
  inherited: true,
};
```

I want to have type of groupId and groupName dependent on the inherited flag value, but given interface is not strict enough to guarantee that objects will be created as expected.

## Better approach - union type

To define an interface for this object, we need to use a union type. Here's the code:

```typescript
interface MyInheritedObject {
  name: string;
  value: string;
  inherited: true;
  groupName: string;
  groupId: string;
}

interface MyObjectNotInherited {
  name: string;
  value: string;
  inherited: false;
  groupName: null;
  groupId: null;
}

type MyObjectUnion = MyInheritedObject | MyObjectNotInherited;
```

In this interface, we have defined two interfaces, `MyInheritedObject` for when `inherited` is always `true` and `MyObjectNotInherited` for when inherited is `false`. The `groupName` and `groupId` properties are required for `MyInheritedObject` and are not allowed for `MyObjectNotInherited`. We have then defined a union type `MyObjectUnion` that can be either `MyInheritedObject` or `MyObjectNotInherited`.

With this interface, we can create objects that conform to this structure, like so:

```typescript
const myObject: MyObjectUnion = {
  name: "myName",
  value: "myValue",
  inherited: false,
  groupName: null,
  groupId: null,
};

const myInheritedObject: MyObjectUnion = {
  name: "myName",
  value: "myValue",
  inherited: true,
  groupName: "myGroupName",
  groupId: "myGroupId",
};
```

This ensures that groupId and groupName are only present when inherited is true. Trying to create an object below will return a type error:

```typescript
const myIncorrectObject: MyObjectUnion = {
  name: "myName",
  value: "myValue",
  inherited: false,
  groupName: "myGroupName",
  groupId: "myGroupId",
};
```

In conclusion, defining interfaces with conditional properties is an important feature of TypeScript. By using a union type and carefully defining our interfaces, we can ensure that our objects conform to the correct structure and prevent errors from occurring.