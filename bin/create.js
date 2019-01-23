#!/usr/bin/env node

const commander = require('commander')
const {
  execSync,
} = require('child_process')
const fs = require('fs')
const tmplTypes = new Map([
  [
    'vue', // 命令行参数
    {
      desc: 'clone vue-template', // 参数说明
      repoName: 'vue-template', // git repository 名称
    },
  ],
  [
    'webpack',
    {
      desc: 'clone webpack-template',
      repoName: 'webpack-template',
    },
  ]
]) // 模板类型

/**
 * git clone
 */
function clone() {
  execSync(`git clone ${getRepoURL()}`)
}

/**
 * 获取仓库名称
 */
function getRepoName() {
  for (let k of tmplTypes.keys()) {
    if (commander[k]) {
      return tmplTypes.get(k).repoName
    }
  }
}

/**
 * 获取 git 仓库地址
 * @return {String} url
 */
function getRepoURL() {
  for (let k of tmplTypes.keys()) {
    if (commander[k]) {
      return `https://github.com/9-lives/${getRepoName()}.git`
    }
  }

  return ''
}

/**
 * 设置命令行参数解析
 */
function parseParams() {
  commander.version(require('../package.json').version)

  for (let [k, v] of tmplTypes.entries()) {
    commander.option(`--${k}`, v.desc)
  }

  commander.parse(process.argv)
}

/**
 * 移除 git 目录
 * @param {String} path 路径
 */
function rmGitDir(path) {
  fs.readdirSync(path).forEach(i => {
    const newPath = `${path}/${i}`

    /**
     * bug
     * 使用三元表达式报错 newPath is not defined
     */
    // (fs.statSync(newPath).isDirectory() ? rmGitDir : fs.unlinkSync)(newPath)

    if (fs.statSync(newPath).isDirectory()) {
      rmGitDir(newPath)
    } else {
      fs.unlinkSync(newPath)
    }
  })

  return fs.rmdirSync(path)
}

(() => {
  parseParams()
  clone()
  console.log('removing .git directory...')
  rmGitDir(`./${getRepoName()}/.git`)
  console.log('done.')
})()