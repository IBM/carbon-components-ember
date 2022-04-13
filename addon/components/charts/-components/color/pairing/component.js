import Component from '@glimmer/component';

/** @documenter yuidoc */
/**
 The ChartAxis

 ```handlebars
 ```
 @class ChartAxis
 @public
 **/
class ChartAxis extends Component {
  args = {
    /**
     * define palette with {numberOfVariants} color variants
     * @argument numberOfVariants
     * @type Number
     */
    numberOfVariants: null,
    /**
     * the option number of the color paring
     * @argument option
     * @type Number
     */
    option: 1,
  }
}

export default ChartAxis;
