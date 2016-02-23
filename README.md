# node-file-vault

Ansible Playbook inspired simple vault

0.0.1beta

# Under development still, but works in simple use.

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
