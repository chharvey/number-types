import {Color} from '../../index'
import test from './test'


export default Promise.all([
	test(new Color(0.5 , 0.5, 0.5, 0.5).rgb.join(), '50%,50%,50%,50%'),
	test(new Color(0.25, 0.5, 1       ).rgb.join(), '25%,50%,100%,100%'),
	test(new Color(                   ).rgb.join(), '0%,0%,0%,0%'),
])