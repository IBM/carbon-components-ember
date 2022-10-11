import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import * as icons from '@carbon/icons/es';
import { bxClassNames, classPrefix, defaultArgs } from 'carbon-components-ember/decorators';

const IconMap = {};
Object.values(icons).forEach((i: any) => {
  IconMap[i.name] = IconMap[i.name] || {};
  IconMap[i.name][i.size] = i;
})

// eslint-disable-next-line max-len
export type IconNames = '3D-Cursor'|  '3D-cursor--alt'|  '3D-curve--auto-colon'|  '3D-curve--auto-vessels'|  '3D-curve--manual'|  '3D-iCa'|  '3D-MPR-Toggle'|  '3D-print-mesh'|  '3D-software'|  '3rd-party-connected'|  '4K'|  '4K--filled'|  'accessibility'|  'accessibility--alt'|  'accessibility--color'|  'accessibility--color--filled'|  'account'|  'activity'|  'add'|  'add--alt'|  'add--filled'|  'add-comment'|  'ai-results'|  'ai-results--high'|  'ai-results--low'|  'ai-results--medium'|  'ai-results--urgent'|  'ai-results--very-high'|  'ai-status'|  'ai-status--complete'|  'ai-status--failed'|  'ai-status--in-progress'|  'ai-status--queued'|  'ai-status--rejected'|  'alarm'|  'alarm--add'|  'alarm--subtract'|  'align--horizontal-center'|  'align--horizontal-left'|  'align--horizontal-right'|  'align--vertical-bottom'|  'align--vertical-center'|  'align--vertical-top'|  'analytics'|  'analytics--reference'|  'angle'|  'annotation-visibility'|  'aperture'|  'api'|  'API--1'|  'app'|  'app-connectivity'|  'app-switcher'|  'apple'|  'application'|  'apps'|  'archive'|  'arrival'|  'arrow--annotation'|  'arrow--down'|  'arrow--down-left'|  'arrow--down-right'|  'arrow--left'|  'arrow--right'|  'arrow--up'|  'arrow--up-left'|  'arrow--up-right'|  'arrow-shift-down'|  'arrows'|  'arrows--horizontal'|  'arrows--vertical'|  'asleep'|  'asleep--filled'|  'asset'|  'at'|  'attachment'|  'audio-console'|  'augmented-reality'|  'auto-scroll'|  'automatic'|  'awake'|  'back-to-top'|  'badge'|  'bar'|  'barrier'|  'basketball'|  'battery--charging'|  'battery--empty'|  'battery--full'|  'battery--half'|  'battery--low'|  'battery--quarter'|  'bee'|  'bicycle'|  'binoculars'|  'bloch-sphere'|  'blockchain'|  'blog'|  'bluetooth'|  'bluetooth--off'|  'bookmark'|  'bookmark--filled'|  'bot'|  'box'|  'box-plot'|  'branch'|  'brightness-contrast'|  'brush-freehand'|  'brush-polygon'|  'building'|  'building--insights-1'|  'building--insights-2'|  'building--insights-3'|  'bullhorn'|  'bus'|  'CAD'|  'cafe'|  'calculator'|  'calculator--check'|  'calendar'|  'calendar--heat-map'|  'calendar--settings'|  'calibrate'|  'camera'|  'camera--action'|  'campsite'|  'car'|  'car--front'|  'carbon'|  'caret--down'|  'caret--left'|  'caret--right'|  'caret--sort'|  'caret--sort--down'|  'caret--sort--up'|  'caret--up'|  'carousel--horizontal'|  'carousel--vertical'|  'catalog'|  'categories'|  'category'|  'category--add'|  'category--and'|  'category--new'|  'category--new-each'|  'ccX'|  'cd--archive'|  'cd--create-archive'|  'cd--create-exchange'|  'CDA'|  'center--circle'|  'center--square'|  'certificate'|  'certificate--check'|  'change-catalog'|  'character-patterns'|  'charging-station'|  'charging-station--filled'|  'chart--3D'|  'chart--area'|  'chart--area-smooth'|  'chart--area-stepper'|  'chart--bar'|  'chart--bar-floating'|  'chart--bar-overlay'|  'chart--bar-stacked'|  'chart--bar-target'|  'chart--bubble'|  'chart--bullet'|  'chart--candlestick'|  'chart--cluster-bar'|  'chart--column'|  'chart--column-floating'|  'chart--column-target'|  'chart--combo'|  'chart--combo-stacked'|  'chart--custom'|  'chart--error-bar'|  'chart--error-bar--alt'|  'chart--evaluation'|  'chart--high-low'|  'chart--histogram'|  'chart--line'|  'chart--line--data'|  'chart--line-smooth'|  'chart--marimekko'|  'chart--multi-line'|  'chart--multitype'|  'chart--network'|  'chart--parallel'|  'chart--pie'|  'chart--point'|  'chart--population'|  'chart--radar'|  'chart--radial'|  'chart--relationship'|  'chart--ring'|  'chart--river'|  'chart--rose'|  'chart--scatter'|  'chart--stacked'|  'chart--stepper'|  'chart--sunburst'|  'chart--t-sne'|  'chart--treemap'|  'chart--venn-diagram'|  'chart--waterfall'|  'chat'|  'chat-bot'|  'checkbox'|  'checkbox--checked'|  'checkbox--checked--filled'|  'checkbox--indeterminate'|  'checkbox--indeterminate--filled'|  'checkbox--undeterminate'|  'checkbox--undeterminate--filled'|  'checkmark'|  'checkmark--filled'|  'checkmark--filled--error'|  'checkmark--filled--warning'|  'checkmark--outline'|  'checkmark--outline--error'|  'checkmark--outline--warning'|  'chemistry'|  'chemistry--reference'|  'chevron--down'|  'chevron--left'|  'chevron--mini'|  'chevron--right'|  'chevron--sort'|  'chevron--sort--down'|  'chevron--sort--up'|  'chevron--up'|  'chip'|  'choices'|  'circle--filled'|  'circle-dash'|  'circle-measurement'|  'circle-packing'|  'circuit-composer'|  'classification'|  'classifier--language'|  'clean'|  'close'|  'close--filled'|  'close--outline'|  'closed-caption'|  'closed-caption--alt'|  'closed-caption--filled'|  'cloud'|  'cloud--data-ops'|  'cloud--download'|  'cloud--lightning'|  'cloud--rain'|  'cloud--snow'|  'cloud--upload'|  'cloud-app'|  'cloud-foundry--1'|  'cloud-foundry--2'|  'cloud-satellite'|  'cloudy'|  'cobb-angle'|  'code'|  'code--reference'|  'cognitive'|  'collaborate'|  'collapse-all'|  'collapse-categories'|  'color-palette'|  'color-switch'|  'column'|  'compare'|  'compass'|  'composer-edit'|  'concept'|  'connect'|  'connection-signal'|  'container-software'|  'content-view'|  'contour-finding'|  'contrast'|  'copy'|  'copy--file'|  'corn'|  'corner'|  'coronavirus'|  'course'|  'covariate'|  'credentials'|  'crop'|  'cross-reference'|  'cross-tab'|  'CSV'|  'cU1'|  'cU3'|  'cube-view'|  'cursor--1'|  'cursor--2'|  'cut'|  'cut-in-half'|  'cY'|  'cyclist'|  'cZ'|  'dashboard'|  'dashboard--reference'|  'data--1'|  'data--2'|  'data--base'|  'data--base--alt'|  'data--check'|  'data--connected'|  'data--error'|  'data--reference'|  'data--set'|  'data--structured'|  'data--unstructured'|  'data-class'|  'data-player'|  'data-refinery'|  'data-refinery--reference'|  'data-share'|  'data-table'|  'data-table--reference'|  'data-vis--1'|  'data-vis--2'|  'data-vis--3'|  'data-vis--4'|  'datastore'|  'debug'|  'decision-tree'|  'delete'|  'delivery-truck'|  'denominate'|  'departure'|  'deploy'|  'deploy-rules'|  'deployment-pattern'|  'deployment-policy'|  'development'|  'devices'|  'dew-point'|  'dew-point--filled'|  'diagram'|  'diagram--reference'|  'dicom--6000'|  'dicom--overlay'|  'direction--bear-right--01'|  'direction--bear-right--01--filled'|  'direction--bear-right--02'|  'direction--bear-right--02--filled'|  'direction--curve'|  'direction--curve--filled'|  'direction--merge'|  'direction--merge--filled'|  'direction--right--01'|  'direction--right--01--filled'|  'direction--right--02'|  'direction--right--02--filled'|  'direction--rotary--first-right'|  'direction--rotary--first-right--filled'|  'direction--rotary--right'|  'direction--rotary--right--filled'|  'direction--rotary--straight'|  'direction--rotary--straight--filled'|  'direction--sharp-turn'|  'direction--sharp-turn--filled'|  'direction--straight'|  'direction--straight--filled'|  'direction--straight--right'|  'direction--straight--right--filled'|  'direction--u-turn'|  'direction--u-turn--filled'|  'distribute--horizontal-center'|  'distribute--horizontal-left'|  'distribute--horizontal-right'|  'distribute--vertical-bottom'|  'distribute--vertical-center'|  'distribute--vertical-top'|  'dna'|  'DOC'|  'document'|  'document--add'|  'document--blank'|  'document--download'|  'document--export'|  'document--import'|  'document--pdf'|  'document--subtract'|  'document--tasks'|  'document--unknown'|  'document--view'|  'document--word-processor'|  'document--word-processor--reference'|  'document-sentiment'|  'dot-mark'|  'double-integer'|  'down-to-bottom'|  'download'|  'download-study'|  'drag--horizontal'|  'drag--vertical'|  'draggable'|  'draw'|  'driver-analysis'|  'drop-photo'|  'drop-photo--filled'|  'DVR'|  'earth'|  'earth--americas'|  'earth--americas--filled'|  'earth--europe-africa'|  'earth--europe-africa--filled'|  'earth--filled'|  'earth--southeast-asia'|  'earth--southeast-asia--filled'|  'edge-cluster'|  'edge-device'|  'edge-enhancement'|  'edge-enhancement--01'|  'edge-enhancement--02'|  'edge-enhancement--03'|  'edge-node'|  'edge-service'|  'edit'|  'edit--off'|  'edit-filter'|  'edt-loop'|  'education'|  'email'|  'email--new'|  'enterprise'|  'erase'|  'erase--3D'|  'error'|  'error--filled'|  'error--outline'|  'event'|  'event--schedule'|  'events'|  'events--alt'|  'exam-mode'|  'exit'|  'expand-all'|  'expand-categories'|  'export'|  'eyedropper'|  'face--activated'|  'face--activated--add'|  'face--activated--filled'|  'face--add'|  'face--cool'|  'face--dissatisfied'|  'face--dissatisfied--filled'|  'face--dizzy'|  'face--dizzy--filled'|  'face--mask'|  'face--neutral'|  'face--neutral--filled'|  'face--pending'|  'face--pending--filled'|  'face--satisfied'|  'face--satisfied--filled'|  'face--wink'|  'face--wink--filled'|  'factor'|  'fade'|  'favorite'|  'favorite--filled'|  'fetch-upload'|  'fetch-upload--cloud'|  'filter'|  'filter--edit'|  'filter--remove'|  'filter--reset'|  'finance'|  'fingerprint-recognition'|  'fire'|  'fish'|  'fish--multiple'|  'fit-to-screen'|  'flag'|  'flag--filled'|  'flagging-taxi'|  'flash'|  'flash--filled'|  'flash--off'|  'flash--off--filled'|  'flow'|  'flow--connection'|  'flow--data'|  'flow--stream'|  'flow--stream--reference'|  'fog'|  'folder'|  'folder--add'|  'folder--details'|  'folder--details--reference'|  'folder--off'|  'folder--shared'|  'folders'|  'fork'|  'forum'|  'forward--10'|  'forward--30'|  'forward--5'|  'fragile'|  'fruit-bowl'|  'function'|  'function-math'|  'fusion-blender'|  'game--console'|  'game--wireless'|  'gamification'|  'gas-station'|  'gender--female'|  'gender--male'|  'generate-pdf'|  'GIF'|  'gift'|  'globe'|  'gradient'|  'graphical-data-flow'|  'grid'|  'group'|  'H'|  'hail'|  'hanging-protocol'|  'harbor'|  'hashtag'|  'haze'|  'haze--night'|  'HD'|  'HD--filled'|  'HDR'|  'headphones'|  'headset'|  'health-cross'|  'hearing'|  'heat-map'|  'heat-map--02'|  'heat-map--03'|  'heat-map--stocks'|  'helicopter'|  'help'|  'help--filled'|  'help-desk'|  'hinton-plot'|  'hole-filling'|  'hole-filling--cursor'|  'home'|  'hospital'|  'hospital-bed'|  'hotel'|  'hourglass'|  'HTML'|  'HTML--reference'|  'HTTP'|  'humidity'|  'humidity--alt'|  'hurricane'|  'hybrid-networking'|  'ibm-cloud'|  'ibm-security'|  'iCA-2D'|  'iD'|  'idea'|  'identification'|  'image'|  'image--medical'|  'image--reference'|  'image--search'|  'improve-relevance'|  'in-progress'|  'in-progress--error'|  'in-progress--warning'|  'incomplete'|  'incomplete--cancel'|  'incomplete--error'|  'incomplete--warning'|  'increase-level'|  'industry'|  'information'|  'information--filled'|  'information--square'|  'information--square--filled'|  'insert'|  'insert--page'|  'integration'|  'interactions'|  'interactive-segmentation-cursor'|  'inventory-management'|  'iot--connect'|  'iot--platform'|  'ISO'|  'ISO--filled'|  'ISO--outline'|  'join--inner'|  'join--left'|  'join--outer'|  'join--right'|  'JPG'|  'JSON'|  'JSON--reference'|  'jump-link'|  'keep-dry'|  'keyboard'|  'language'|  'laptop'|  'lasso'|  'launch'|  'launch-study--1'|  'launch-study--2'|  'launch-study--3'|  'legend'|  'letter--Aa'|  'letter--Bb'|  'letter--Cc'|  'letter--Dd'|  'letter--Ee'|  'letter--Ff'|  'letter--Gg'|  'letter--Hh'|  'letter--Ii'|  'letter--Jj'|  'letter--Kk'|  'letter--Ll'|  'letter--Mm'|  'letter--Nn'|  'letter--Oo'|  'letter--Pp'|  'letter--Qq'|  'letter--Rr'|  'letter--Ss'|  'letter--Tt'|  'letter--Uu'|  'letter--Vv'|  'letter--Ww'|  'letter--Xx'|  'letter--Yy'|  'letter--Zz'|  'light'|  'light--filled'|  'lightning'|  'link'|  'list'|  'list--boxes'|  'list--bulleted'|  'list--checked'|  'list--dropdown'|  'list--numbered'|  'location'|  'locked'|  'login'|  'logo--digg'|  'logo--facebook'|  'logo--flickr'|  'logo--github'|  'logo--glassdoor'|  'logo--instagram'|  'logo--jupyter'|  'logo--keybase'|  'logo--linkedin'|  'logo--livestream'|  'logo--medium'|  'logo--openshift'|  'logo--pinterest'|  'logo--python'|  'logo--quora'|  'logo--r-script'|  'logo--skype'|  'logo--slack'|  'logo--snapchat'|  'logo--tumblr'|  'logo--twitter'|  'logo--vmware'|  'logo--xing'|  'logo--yelp'|  'logo--youtube'|  'logout'|  'loop'|  'mac--command'|  'mac--option'|  'mac--shift'|  'machine-learning'|  'machine-learning-model'|  'magic-wand'|  'magic-wand--filled'|  'magnify'|  'mail--all'|  'mail--reply'|  'mammogram'|  'manage-protection'|  'managed-solutions'|  'map'|  'math-curve'|  'matrix'|  'maximize'|  'medication'|  'medication--alert'|  'medication--reminder'|  'menu'|  'meter'|  'meter--alt'|  'microphone'|  'microphone--filled'|  'microphone--off'|  'microphone--off--filled'|  'microscope'|  'migrate'|  'migrate--alt'|  'milestone'|  'minimize'|  'misuse'|  'misuse--alt'|  'misuse--outline'|  'mixed-rain-hail'|  'mobile'|  'mobile--add'|  'mobile--audio'|  'mobile--check'|  'mobile--download'|  'mobile--landscape'|  'model'|  'model--alt'|  'model--reference'|  'model-builder'|  'model-builder--reference'|  'money'|  'monument'|  'moon'|  'mostly-cloudy'|  'mostly-cloudy--night'|  'mountain'|  'MOV'|  'move'|  'movement'|  'MP3'|  'MP4'|  'MPEG'|  'MPG2'|  'music'|  'network--1'|  'network--2'|  'network--3'|  'network--3--reference'|  'network--4'|  'new-tab'|  'next--filled'|  'next--outline'|  'no-image'|  'no-ticket'|  'nominal'|  'nominate'|  'noodle-bowl'|  'not-available'|  'not-sent'|  'not-sent--filled'|  'notebook'|  'notebook--reference'|  'notification'|  'notification--filled'|  'notification--new'|  'notification--off'|  'notification--off--filled'|  'number--0'|  'number--1'|  'number--2'|  'number--3'|  'number--4'|  'number--5'|  'number--6'|  'number--7'|  'number--8'|  'number--9'|  'number--small--0'|  'number--small--1'|  'number--small--2'|  'number--small--3'|  'number--small--4'|  'number--small--5'|  'number--small--6'|  'number--small--7'|  'number--small--8'|  'number--small--9'|  'object-storage'|  'omega'|  'opacity'|  'open-panel--bottom'|  'open-panel--filled--bottom'|  'open-panel--filled--left'|  'open-panel--filled--right'|  'open-panel--filled--top'|  'open-panel--left'|  'open-panel--right'|  'open-panel--top'|  'operation'|  'operation--gauge'|  'operation--if'|  'operations--field'|  'operations--record'|  'ordinal'|  'overflow-menu--horizontal'|  'overflow-menu--vertical'|  'package'|  'page--first'|  'page--last'|  'page-scroll'|  'paint-brush'|  'paint-brush--alt'|  'pan--horizontal'|  'pan--vertical'|  'panel-expansion'|  'paragraph'|  'parent-child'|  'partly-cloudy'|  'partly-cloudy--night'|  'partnership'|  'password'|  'paste'|  'pause'|  'pause--filled'|  'pause--outline'|  'pause--outline--filled'|  'PDF'|  'PDF--reference'|  'pedestrian'|  'pedestrian-child'|  'pending'|  'pending--filled'|  'percentage'|  'percentage--filled'|  'person'|  'person--favorite'|  'pet-image--B'|  'pet-image--O'|  'phone'|  'phone--filled'|  'phone--off'|  'phone--off--filled'|  'phrase-sentiment'|  'picnic-area'|  'pills'|  'pills--add'|  'pills--subtract'|  'pin'|  'pin--filled'|  'plane'|  'play'|  'play--filled'|  'play--filled--alt'|  'play--outline'|  'play--outline--filled'|  'playlist'|  'plug'|  'plug--filled'|  'PNG'|  'pointer-text'|  'police'|  'policy'|  'popup'|  'portfolio'|  'power'|  'PPT'|  'presentation-file'|  'pressure'|  'pressure--filled'|  'previous--filled'|  'previous--outline'|  'printer'|  'product'|  'purchase'|  'qq-plot'|  'qr-code'|  'quadrant-plot'|  'query-queue'|  'queued'|  'quotes'|  'radio'|  'radio-button'|  'radio-button--checked'|  'rain'|  'rain--drizzle'|  'rain--heavy'|  'rain--scattered'|  'rain--scattered--night'|  'rain-drop'|  'RAW'|  'receipt'|  'recently-viewed'|  'recommend'|  'recording'|  'recording--filled'|  'recording--filled--alt'|  'redo'|  'reflect--horizontal'|  'reflect--vertical'|  'region-analysis--area'|  'region-analysis--volume'|  'registration'|  'reminder'|  'reminder--medical'|  'renew'|  'repeat'|  'repeat--one'|  'reply'|  'report'|  'report--data'|  'request-quote'|  'research--bloch-sphere'|  'research--hinton-plot'|  'research--matrix'|  'reset'|  'reset--alt'|  'restart'|  'restaurant'|  'restaurant--fine'|  'rewind--10'|  'rewind--30'|  'rewind--5'|  'roadmap'|  'rocket'|  'rotate'|  'rotate--180'|  'rotate--360'|  'rotate--clockwise'|  'rotate--clockwise--alt'|  'rotate--clockwise--alt--filled'|  'rotate--clockwise--filled'|  'rotate--counterclockwise'|  'rotate--counterclockwise--alt'|  'rotate--counterclockwise--alt--filled'|  'rotate--counterclockwise--filled'|  'row'|  'row--collapse'|  'row--expand'|  'rss'|  'rule'|  'ruler'|  'ruler--alt'|  'run'|  'S'|  'S--alt'|  'sankey-diagram'|  'save'|  'save--annotation'|  'save--image'|  'save--model'|  'save--series'|  'scale'|  'scalpel'|  'scalpel--cursor'|  'scalpel--lasso'|  'scalpel--select'|  'scan'|  'scatter-matrix'|  'schematics'|  'scooter'|  'scooter--front'|  'screen'|  'screen--off'|  'script'|  'script--reference'|  'SDK'|  'search'|  'security'|  'select--01'|  'select--02'|  'send'|  'send--alt'|  'send--alt--filled'|  'send--filled'|  'service-desk'|  'settings'|  'settings--adjust'|  'share'|  'share-knowledge'|  'shopping--bag'|  'shopping--cart'|  'shopping--catalog'|  'shrink-screen'|  'shrink-screen--filled'|  'shuffle'|  'shuttle'|  'sigma'|  'signal-strength'|  'skill-level'|  'skill-level--advanced'|  'skill-level--basic'|  'skill-level--intermediate'|  'skip--back'|  'skip--back--filled'|  'skip--back--outline'|  'skip--back--outline--filled'|  'skip--back--outline--solid'|  'skip--back--solid--filled'|  'skip--forward'|  'skip--forward--filled'|  'skip--forward--outline'|  'skip--forward--outline--filled'|  'skip--forward--outline--solid'|  'skip--forward--solid--filled'|  'sleet'|  'smell'|  'smoke'|  'smoothing'|  'smoothing--cursor'|  'snooze'|  'snow'|  'snow--blizzard'|  'snow--heavy'|  'snow--scattered'|  'snow--scattered--night'|  'snowflake'|  'soccer'|  'spell-check'|  'spine-label'|  'split'|  'split--discard'|  'split-screen'|  'spray-paint'|  'sprout'|  'SQL'|  'stack-limitation'|  'stacked-move'|  'stacked-scrolling--1'|  'stacked-scrolling--2'|  'stamp'|  'star'|  'star--filled'|  'star--half'|  'star--review'|  'stem-leaf-plot'|  'stethoscope'|  'stop'|  'stop--filled'|  'stop--filled--alt'|  'stop--outline'|  'stop--outline--filled'|  'store'|  'strawberry'|  'stress-breath-editor'|  'string-integer'|  'string-text'|  'study--next'|  'study--previous'|  'study--skip'|  'sub-volume'|  'subtract'|  'subtract--alt'|  'summary--KPI'|  'sun'|  'sunny'|  'sunrise'|  'sunset'|  'SVG'|  'swim'|  'switcher'|  'sys-provision'|  'T'|  'T--alt'|  'table'|  'table--split'|  'table-of-contents'|  'tablet'|  'tablet--landscape'|  'tag'|  'tag--edit'|  'tag--group'|  'task'|  'task--view'|  'taste'|  'taxi'|  'temperature'|  'temperature--frigid'|  'temperature--hot'|  'template'|  'tennis'|  'tennis-ball'|  'term'|  'terminal'|  'text--align--center'|  'text--align--justify'|  'text--align--left'|  'text--align--right'|  'text--all-caps'|  'text--bold'|  'text--color'|  'text--creation'|  'text--fill'|  'text--highlight'|  'text--indent'|  'text--indent--less'|  'text--indent--more'|  'text--italic'|  'text--kerning'|  'text--leading'|  'text--line-spacing'|  'text--new-line'|  'text--scale'|  'text--selection'|  'text--small-caps'|  'text--strikethrough'|  'text--subscript'|  'text--superscript'|  'text--tracking'|  'text--underline'|  'text--vertical-alignment'|  'text--wrap'|  'text-annotation-toggle'|  'text-link'|  'text-link--analysis'|  'text-mining'|  'text-mining--applier'|  'theater'|  'this-side-up'|  'threshold'|  'thumbnail--1'|  'thumbnail--2'|  'thumbnail-preview'|  'thumbs-down'|  'thumbs-up'|  'thunderstorm'|  'thunderstorm--scattered'|  'thunderstorm--scattered--night'|  'thunderstorm--severe'|  'thunderstorm--strong'|  'ticket'|  'TIF'|  'time'|  'time-plot'|  'timer'|  'tool-box'|  'tools'|  'tornado'|  'touch--1'|  'touch--2'|  'touch--interaction'|  'train'|  'tram'|  'transgender'|  'translate'|  'trash-can'|  'tree'|  'tree-view'|  'tree-view--alt'|  'trophy'|  'trophy--filled'|  'tropical-storm'|  'TSV'|  'two-person-lift'|  'TXT'|  'TXT--reference'|  'type-pattern'|  'types'|  'U1'|  'U2'|  'U3'|  'umbrella'|  'undefined'|  'undefined--filled'|  'undo'|  'unknown'|  'unknown--filled'|  'unlink'|  'unlocked'|  'up-to-top'|  'upgrade'|  'upload'|  'USB'|  'user'|  'user--activity'|  'user--admin'|  'user--avatar'|  'user--avatar--filled'|  'user--avatar--filled--alt'|  'user--certification'|  'user--data'|  'user--favorite'|  'user--favorite--alt'|  'user--favorite--alt--filled'|  'user--filled'|  'user--follow'|  'user--identification'|  'user--multiple'|  'user--online'|  'user--profile'|  'user--role'|  'user--simulation'|  'user--speaker'|  'user--x-ray'|  'user-profile--alt'|  'uv-index'|  'uv-index--filled'|  'van'|  'video'|  'video--add'|  'video--chat'|  'video--filled'|  'video--off'|  'video--off--filled'|  'view'|  'view--filled'|  'view--mode-1'|  'view--mode-2'|  'view--off'|  'view--off--filled'|  'virtual-column'|  'virtual-column--key'|  'virtual-machine'|  'virtual-private-cloud'|  'virtual-private-cloud--alt'|  'visual-recognition'|  'vmdk-disk'|  'voicemail'|  'volume--down'|  'volume--down--filled'|  'volume--mute'|  'volume--mute--filled'|  'volume--up'|  'volume--up--filled'|  'VPN'|  'wallet'|  'warning'|  'warning--alt'|  'warning--alt--filled'|  'warning--alt-inverted'|  'warning--alt-inverted--filled'|  'warning--filled'|  'warning-square'|  'warning-square--filled'|  'watch'|  'watson'|  'watson--machine-learning'|  'websheet'|  'wheat'|  'wifi'|  'wifi--off'|  'wikis'|  'window--auto'|  'window--base'|  'window--overlay'|  'window--preset'|  'windy'|  'windy--dust'|  'windy--snow'|  'windy--strong'|  'wintry-mix'|  'wireless-checkout'|  'WMV'|  'word-cloud'|  'workspace'|  'workspace--import'|  'worship'|  'worship--christian'|  'worship--jewish'|  'worship--muslim'|  'X'|  'x-axis'|  'XLS'|  'XML'|  'Y'|  'y-axis'|  'Z'|  'z-axis'|  'ZIP'|  'ZIP--reference'|  'zoom--in'|  'zoom--out'|  'zoom--reset'|  'zoom-pan';

type Args = {
  /**
   * Indicates if the icon is in loading state
   @argument loading
   @type boolean
   */
  loading?: boolean;
  /**
   * Indicates if the icon is informative
   @argument info
   @type boolean
   */
  info?: boolean;
  /**
   * Indicates if the action is dangerous, showing a confirmation dialog before calling `onClick`
   @argument danger
   @type boolean
   */
  danger?: boolean;
  /**
   * If the action is dangerous, this text message will be shown in the dialog
   @argument confirmText
   @type String
   */
  confirmText?: string;
  /**
   * Use this component as dialog
   @argument confirmDialog
   @type String
   */
  confirmDialog?: string;
  /**
   * Use this icon to display
   @argument icon
   @type String
   */
  icon: IconNames;
  /**
   * Size of icon
   @argument size
   @type number
   */
  size?: 16|20|24|32;
  /**
   * action to trigger on click
   @argument onClick
   @type function
   */
  onClick?: () => void|Promise<any>;

  /**
   * button style
   @argument btnStyle
   @type string
   */
  btnStyle?: string;

  /**
   * button classes
   @argument btnClass
   @type string
   */
  btnClass?: string;
  svgClass?: string;
  fill?: string;
}

@classPrefix('cds--icon--')
class CarbonIcon extends Component<Args> {
  static positionalParams = ['icon'];
  @service('carbon-components-ember@dialog-manager') dialogManager;
  @bxClassNames('info', 'danger', 'disabled') bxClassNames: string;
  @tracked loading;
  @tracked disabled;

  get svg() {
    return IconMap[this.args.icon] && IconMap[this.args.icon][this.args.size || 16];
  }

  @action
  onIconClick() {
    const run = () => {
      const promise = this.args.onClick && this.args.onClick();
      this.loading = true;
      this.disabled = true;
      if (promise && promise.then) {
        const finish = () => {
          this.loading = false;
          this.disabled = false;
        };
        promise.then(finish, finish);
      } else {
        setTimeout(() => {
          if (this.isDestroyed) return;
          this.loading = false;
          this.disabled = false;
        }, 350);
      }
    };
    if (this.args.danger) {
      this.dialogManager.open(this.args.confirmDialog || 'carbon-components-ember/components/dialogs/confirm', {
        type: 'danger',
        header: 'Danger',
        body: this.args.confirmText || 'Confirm this operation',
        onAccept: run
      });
    } else {
      run();
    }
  }
}

export default CarbonIcon;



