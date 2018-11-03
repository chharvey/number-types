import {Color, ColorSpace} from '../../index'
import test from './test'


export default Promise.all([
	test(Color.fromString('hwb(0,0,0)').toString(), '#ff0000'),
	test(Color.fromString('#e4f0f6'   ).toString(ColorSpace.HWB), 'hwb(200deg 89% 4%)'),
	test(Color.fromString(            ).toString(), '#00000000'),
	test(Color.fromString('black'     ).toString(), '#000000'),
	test(Color.fromString('palegreen' ).toString(), '#98fb98'),
	test((() => {
		try {
			return Color.fromString('blanco').toString()
		} catch (e) {
			return e.name
		}
	})(), 'ReferenceError'),
])
