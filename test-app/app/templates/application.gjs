import { Add, _4K as KK } from 'carbon-components-ember/icons';
import { Select } from 'carbon-components-ember/components/index';
import { array } from '@ember/helper';
import { tracked } from '@glimmer/tracking';


class State {
  @tracked selected = [1,2]

  update = (s) => {
    this.selected = s;
  }
}

const state = new State();

<template>
  <Add />
  <KK @size={{124}}/>

  <br>
  <br>
  <br>

  <div style="width: 300px">
    <Select @onSelect={{state.update}} @multiple={{true}} @placeholder='label' @selected={{state.selected}} @options={{array 1 2 3 4 }} as |item|>
      {{item}}
    </Select>
  </div>
</template>

