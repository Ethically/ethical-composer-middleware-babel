import { transform } from 'babel-core'

const ethicalFileComposerTranspiler = async (ctx, next, opts) => {

    const { file } = ctx
    const { contents, path } = file
    const { babel } = opts

    if (typeof babel !== 'object') return await next()

    const config = {
        ...babel,
        sourceMaps: true,
        sourceMapTarget: path
    }
    const transpiledSource = transform(contents, config)
    file.contents = new Buffer(transpiledSource.code)
    file.map = new Buffer(JSON.stringify(transpiledSource.map))
    await next()
}

const ethicalFileComposerTranspilerInit = (opts = {}) => (
    async (ctx, next) => (
        await ethicalFileComposerTranspiler(ctx, next, opts)
    )
)

export default ethicalFileComposerTranspilerInit
