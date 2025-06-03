import { Add, _4K as KK } from 'carbon-components-ember/icons';
import { Select } from 'carbon-components-ember/components/index';
import { array } from '@ember/helper';


<template>
  <Add />
  <KK @size={{124}}/>

  <br>
  <br>
  <br>

  <div style="width: 300px">
    <Select @multiple={{true}} @placeholder='label' @selected={{array 2 3}} @options={{array 1 2 3 4 }} as |item|>
      {{item}}
    </Select>
  </div>
</template>

