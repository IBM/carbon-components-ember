import { Add, _4K as KK } from 'carbon-components-ember/icons';
import { Select } from 'carbon-components-ember/components/index';
import { tracked } from '@glimmer/tracking';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';


class State {
  @tracked selected = '1';
  @tracked options = ['1','2','3','4', '23423423', 'asdaszudgia', 'f67gz8n']

  update = (s) => {
    this.selected = s;
  }
}

const state = new State();

function noop() {

}

<template>
  <Add />
  <KK @size={{124}}/>

  <br>
  <br>
  <br>

  <div {{didInsert noop}}>
    <div style="width: 120px; margin-left: 30px">
      <Select @disabled={{true}} @inline={{true}} @searchPlaceholder='type to search' @onSelect={{state.update}} @multiple={{false}} @placeholder='label' @selected={{state.selected}} @options={{state.options}} as |item|>
        {{item}}
      </Select>
    </div>
    <div style="width: 170px; margin-left: 30px">
      <Select @disabled={{true}}  @searchEnabled={{true}} @searchPlaceholder='type to search' @onSelect={{state.update}} @multiple={{false}} @placeholder='label' @selected={{state.selected}} @options={{state.options}} as |item|>
        {{item}}
      </Select>
    </div>
  </div>
</template>

