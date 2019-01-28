#!/usr/bin/env node

const commander = require('commander')
const {
  execSync,
} = require('child_process')
const fs = require('fs')

function create () {
  commander.command('create')
    .description('create templates')
    .option('--vue', 'clone vue-template')
    .option('--webpack', 'clone webpack-template')
    .action(options => {
      const url = getRepoURL(options)

      execSync(`git clone ${url}`)
      rmDir(`./${str.substring(str.lastIndexOf('/') + 1, str.lastIndexOf('.'))}/.git`)
    })

  /**
   * 根据参数取仓库地址
   */
  function getRepoURL ({ vue, webpack }) {
    let url

    if (vue) {
      url = `https://github.com/9-lives/vue-template.git`
    } else if (webpack) {
      url = `https://github.com/9-lives/webpack-template.git`
    } else {
      throw new Error('invalid arguments')
    }

    return url
  }
}

/**
 * 移除目录
 * @param {String} path 路径
 */
function rmDir(path) {
  fs.readdirSync(path).forEach(i => {
    /**
     * bug
     * 使用三元表达式报错 newPath is not defined
     */
    // (fs.statSync(newPath).isDirectory() ? rmDir : fs.unlinkSync)(newPath)
    const newPath = `${path}/${i}`
    const fn = fs.statSync(newPath).isDirectory() ? rmDir : fs.unlinkSync

    fn(newPath)
  })

  return fs.rmdirSync(path)
}

(() => {
  commander.version(require('../package.json').version)
  create()
  commander.parse(process.argv)
})()