#!/usr/bin/env node
/* jshint undef: false, unused: true */
'use strict';

var fs = require('fs'),
    argv = require('yargs').argv,
    crypto = require('crypto'),
    process = require('process'),
    path = require('path'),
    chalk = require('chalk');

var errorText = chalk.bold.red,
    successText = chalk.bold.green;

var algorithm = 'aes-256-ctr',
    CWD = process.cwd(),
    mode = argv._[0],
    filePath = argv._[1];


if(mode !== "decrypt" && mode !== "encrypt"){
  console.log(errorText('[Error] encrypt or decrypt first...') );
  return;
}

if( !filePath && typeof filePath !== "string" ) {
  console.log(errorText('[Error] No file given...'));
  return;
}

var raw_content;
var file = path.normalize(CWD + "/" + filePath);

try {
  raw_content = fs.readFileSync( file, 'utf8');
} catch(err) {
  console.log(errorText('[Error] Unable to find such file') );
  console.log(err);
  return;
}

/**
 * Finds the pathname of the parent module's package descriptor file. If the
 * directory is undefined (the default case), then it is set to the directory
 * name of the parent module's filename. If no package.json file is found, then
 * the parent directories are recursively searched until the file is found or
 * the root directory is reached. Returns the pathname if found or null if not.
 * Ref: https://gist.github.com/fhellwig/3355047
 **/
function findParentPkgDesc(directory) {
    if (!directory) {
        directory = path.dirname(module.parent.filename);
    }
    var file = path.resolve(directory, 'package.json');
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        return file;
    }
    var parent = path.resolve(directory, '..');
    if (parent === directory) {
      throw "package.json not found.";
    }
    return findParentPkgDesc(parent);
}

var packageDir = path.dirname( findParentPkgDesc(CWD) );

function getPassword() {
  var password;
  try {
    password = fs.readFileSync( packageDir + "/.vault_key", 'utf8');
  } catch(err) {
    throw err;
  }
  return password;
}

var prepend = "VAULT;0.1;aes-256-ctr;VAULT\n";
var vaultKey = getPassword();


function encrypt(text){
  var cipher = crypto.createCipher(algorithm, vaultKey);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm, vaultKey);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}
function isEncryptable(raw) {
  var arr = raw.split(prepend);
  if(arr.length !== 2){
    return true;
  } else {
    console.log( errorText("[Error]") + " File is already encrypted." );
    throw "error";
  }
}

function checkDecryptable(raw) {
  var arr = raw.split(prepend);
  if(arr.length !== 2){
    console.log(errorText("[Error]") + " Encryption method doesn't match.");
    throw "error";
  } else {
    return arr[1];
  }
}

if( mode === "encrypt" && isEncryptable(raw_content) ) {
  try {
    fs.writeFileSync(file, prepend + encrypt(raw_content), 'utf8');
  } catch(err){
    throw err;
  }
  console.log(successText('[Success]') + ' Encrypted file: ' + file );
  return;
}

if( mode === "decrypt"){
  var text = checkDecryptable(raw_content);
  if(!text) return;
  try {
    fs.writeFileSync(file, decrypt(text), 'utf8');
  } catch(err){
    throw err;
  }
  console.log(successText('[Success]') + ' Decrypted file: ' + file );
  return;
}
