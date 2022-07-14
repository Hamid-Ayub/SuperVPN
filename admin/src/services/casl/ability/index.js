import React from "react";
import { Ability, AbilityBuilder } from '@casl/ability';
import configureStore from "@app/redux/configureStore";

function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }
  // eslint-disable-next-line no-underscore-dangle
  return item.__type;
}

const ability = new Ability([], { subjectName });

function defineRulesFor(user) {
  const { can, rules } = AbilityBuilder?.extract();

  if (user?.email !== process.env.EMAIL) {
    can("edit", "functions");
  }

  can("view", "functions");

  return rules;
}

let user = {}
configureStore.subscribe(async () => {
  const prevRole = {user}
  user = configureStore?.getState()?.global?.user

  if (user) {
    ability.update(defineRulesFor(user));
  }
});

export const runFunction = ({email, cb}) => {
  if (email !== process.env.EMAIL) {
    cb()
  }
}

export const CanView = ({email, children}) => {
  if (email !== process.env.EMAIL) {
    return children
  }

  return null;
}

export default ability;
