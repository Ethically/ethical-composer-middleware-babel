import Vinyl from 'vinyl'
import fileTranspilerMiddleware from '../../src/index.js'

const source = 'import hello from "world"'
const babelSource = `
"use strict";

var _world = require("world");

var _world2 = _interopRequireDefault(_world);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
`
const sourceMap = `{"version":3,"sources":["unknown"],"names":[],"mappings":";;AAAA","file":"unknown","sourcesContent":["import hello from \\"world\\""]}`
const contents = new Buffer(source)
const file = (map, path = '') => new Vinyl({ path, contents, map })

const babelConfig = {
    presets: [
        [
            'env',
            {
                targets: {
                    browsers: ['ie >= 11']
                },
                debug: false,
                useBuiltIns: true
            }
        ]
    ]
}

describe('fileTranspilerMiddleware()', () => {
    
    it('should transpile file', async (done) => {
        const next = jasmine.createSpy('next')
        const ctx = { file: file() }
        const config = { babel: babelConfig }
        await fileTranspilerMiddleware(config)(ctx, next)
        expect(ctx.file.contents.toString().trim()).toBe(babelSource.trim())
        expect(next).toHaveBeenCalled()
        done()
    })

    it('should generate a source map', async (done) => {
        const next = jasmine.createSpy('next')
        const ctx = { file: file() }
        const config = { babel: babelConfig }
        await fileTranspilerMiddleware(config)(ctx, next)
        expect(ctx.file.map.toString().trim()).toBe(sourceMap.trim())
        expect(next).toHaveBeenCalled()
        done()
    })

    it('should leave file as is', async (done) => {
        const next = jasmine.createSpy('next')
        const ctx = { file: file() }
        const { contents, map } = ctx.file
        await fileTranspilerMiddleware()(ctx, next)
        expect(ctx.file.contents).toBe(contents)
        expect(ctx.file.map).toBe(map)
        expect(next).toHaveBeenCalled()
        done()
    })
})
