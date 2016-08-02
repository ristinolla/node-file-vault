# node-file-vault

[![Build Status](https://travis-ci.org/ristinolla/node-file-vault.svg?branch=master)](https://travis-ci.org/ristinolla/node-file-vault)

Ansible Playbook inspired simple vault to secure files. Handy for sharing for example environment settings in repository.

# Under development still, but works in simple use.

Versions < 1.0.0 are considered as Beta.

## How to use

### Install

    npm node-file-vault install -g

Global is more handy, so you can use it anywhere.

### Generate keyfile

Add keyfile called <code>.vault_key</code> to your project file. It is searched from parent directories just like a Gulpfile or a package.json. In this key file just include random key, it is your password to files.

    thisshouldbesomewhatlongkeyboardcat

**Be sure to gitignore .vault_key!**

### Encrypt

To encrypt a file type:

    vault encrypt <file>

### Decrypt

To decrypt encrypted file, be sure that you have the <code>.vault_key</code> file .

    vault encrypt <file>
