---
title: 'Build a React Native Project for iOS, from Linux'
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  Don't have access to a MacOS computer? Learn how to use a Linux computer and a
  remote MacOS server to build your React Native project for iOS.
date: 2019-12-23 12:06:52
tags:
---


Apple has done a great job of locking in developers by ensuring the Xcode toolchain can only run on MacOS products. For people who prefer working on Linux machines, this is very frustrating. We wanted a way to run our builds from our Linux computers.

Before you get too excited, this method still requires that you have a MacOS machine to build your project on. 



## Getting started

1. A Mac. This can be a physical machine like an old Macbook, a Mac Mini, or a Mac Server. Or, it could be a Mac VPS rented from a service like [MacinCloud](https://www.macincloud.com/) or other VPS providers.
2. A Linux computer.
3. An iPhone or iPad connected via USB to the Linux computer.


## Setting up the Mac

### SSH Access

First thing's first: you're going to need to be able to SSH into the Mac from your Linux machine. That means you'll need to enable remote connections on the Mac and add your public SSH key to the `~/.ssh/authorized_keys` file.

We won't cover the SSH setup in this tutorial, but there are many resources on the internet which can help you do so.


### Xcode toolchain

Install the Xcode command line tools by running:

```bash
xcode-select --install
```

### fastlane

[`fastlane`](https://fastlane.tools/) is a toolkit for automating tasks related to iOS and Android builds. We use it to do the complicated things like managing provisioning profiles and codesigning.

To install fastlane, [check out their installation instructions](https://docs.fastlane.tools/getting-started/ios/setup/).


### Git access

You'll need to create a git repository, on Gitlab or Github, where fastlane will store your signing certificates (encrypted). Your Mac needs to be set up to access this git repository via an SSH url (e.g. git@gitlab.com:user/repo.git).

If you can clone the repo without it asking for a username / password, you're all good.


### Other build requirements for React Native

Any tools that you use to build your React Native project need to be available. For example, `npm`, `yarn`, etc.


## Setting up the Linux machine

### SSH Access to the Mac

To make your life simpler, set up a record in your `~/.ssh/config` file so that you can easily SSH into the Mac. This will make using some of the other tools easier.

We'll assume that you can SSH into your Mac machine by using the command `ssh mac`.


### Install required tools

You'll need to have access to the following commands:

- `tar`
- `rsync`
- `git`
- `scp`
- [`ideviceinstaller`](https://github.com/libimobiledevice/ideviceinstaller)
- [`fastlane`](https://docs.fastlane.tools/getting-started/ios/setup/) (yes, you probably need it installed on both machines)


## Apple Developer setup

### Bundle ID creation

You'll need to make sure your bundle identifier is created. To do this:

1. Visit https://developer.apple.com/account/
2. Sign in with your account
3. Navigate to https://developer.apple.com/account/resources/identifiers/list
4. Add a new App identifier

Take note of your Bundle Identifier you entered


### Team ID

You need to note your Team ID. You can get this by visiting https://developer.apple.com/account/#/membership/.


### Devices

You need to make sure your device is added to the list at https://developer.apple.com/account/resources/devices/


## React Native project setup

The important thing here is getting your project set up to build with fastlane. We'll start from a fresh React Native project to illustrate things from the start.

First, we'll create a new React Native project:

```bash
npm install react-native
npx react-native init reactnativetest
```

Then, we'll initialize fastlane for the project:

```bash
cd reactnativetest/ios
fastlane init
```

When it asks you __What would you like to use fastlane for?__, select __Manual setup__.

Finally, you need to create your `Fastfile`, which tells fastlane what commands to execute (in this case to build the React Native project).

This takes some tinkering. Here's what worked for us:

```ruby
# must match the bundle ID in Apple Developer Setup (above)
BUNDLE_ID = 'your-bundle-id'

# must match your Apple Developer Team ID
TEAM_ID = 'your-team-id' 

# the email associated with your Apple Developer account
ICLOUD_USERNAME = 'your-login@icloud.com' 

# the path to Info.plist. normally, this is 'projectname/Info.plist'
PLIST_PATH = 'reactnativetest/Info.plist' 

# the scheme (normally just your project name)
SCHEME = 'reactnativetest'

# the git repo where fastlane Match will store your certs
GIT_REPO = 'git@gitlab.com:user/repo.git' 

update_fastlane
default_platform(:ios)

platform :ios do
  desc "Builds the app for iOS"
  lane :build do

    # specify the team_id we want to use for this build
    team_id(TEAM_ID)
    
    # make sure the xcode project has the appropriate settings
    update_app_identifier(app_identifier: BUNDLE_ID, plist_path: PLIST_PATH)
    update_project_team(teamid: TEAM_ID)

    # install dependencies
    sh('cd ../.. && yarn install')
    cocoapods

    # set up code signing using a temporary keychain
    disable_automatic_code_signing
    delete_keychain(name: "codesigning.keychain") if File.exist?(File.expand_path("~/Library/Keychains/codesigning.keychain-db"))
    create_keychain(name: 'codesigning.keychain', default_keychain: true, unlock: true, timeout: false, password: 'codesigning')

    # set up provisioning profiles and code signing
    match(
      type: 'development',
      username: ICLOUD_USERNAME,
      app_identifier: BUNDLE_ID,
      keychain_name: 'codesigning.keychain',
      keychain_password: 'codesigning',
      force: true,
      git_url: GIT_REPO 
    )

    # run the build
    gym(
      scheme: SCHEME,
      export_method: 'development', 
      xcargs: {
        :PROVISIONING_PROFILE_SPECIFIER => 'match Development ' + BUNDLE_ID
      }
    )
  end
end
```

After that, you should be good to go!


## Building the project

Finally, here's the fun part! Here are the steps for building:

1. Uploading the project to the MacOS server. This will be run once, for the first build.
2. Updating the project on the MacOS server. On the first build, this will do nothing, but on subsequent builds we'll upload any changes.
3. Executing the build on the MacOS server.
4. Downloading the built .ipa file.
5. Installing the built .ipa file to the iPhone, connected to your Linux computer.


### Uploading the project to the MacOS server

To do the initial upload, we're going to create a tarball of the project and upload it to the remote server. This is especially important if you have a large project, as the tarball upload will be quicker than the method we will use to update files on the remote server. The issue, though, is that we do not want to include any installed dependencies (such as `node_modules` or installed Pods). 

Luckily, `react-native init` generates a `.gitignore` file which excludes all these by default.

If you haven't set up a git repo for your project, you need to do the following:

```bash
git init
git add .
```

Then, we'll create a tarball of the project as follows:

```bash
git ls-files -z | xargs -0 tar -cvf archive.tar.gz 
```

We'll upload the new archive to the MacOS server and extract it:

```bash
# create a new folder on the remote server
ssh mac 'cd ~ && mkdir reactnativetest'

# upload the archive
scp ./archive.tar.gz mac:~/reactnativetest

# extract the archive
ssh mac 'cd ~/reactnativetest && tar -xvf archive.tar.gz'
```

Finally, we'll clean up the mess we made.

```bash
rm archive.tar.gz
ssh mac 'rm ~/reactnativetest/archive.tar.gz'
```


### Updating the project on the MacOS server

This part is a bit simpler.  After we've uploaded the initial tarball, we'll use `rsync` to upload any changes we make.  Again, we'll need to make sure we don't upload any of the `node_modules` or other dependencies.

```bash
rsync -avzP --delete --exclude=".git" --exclude-from=".gitignore" . mac:~/reactnativetest 
```

That's it! `rsync` is a great tool.


### Executing the build on the remote server

This is also a single command, luckily!

We're going to use two variables when we run the build:

- `FASTLANE_PASSWORD` passes your icloud password to Fastlane (use to access the API to download provisioning profiles and code signing certificates
- `MATCH_PASSWORD` is the password Fastlane uses to encrypt your generated provisioning profiles and signing certificates.

```bash
ssh mac 'cd ~/reactnativetest/ios && FASTLANE_PASSWORD=your_icloud_password MATCH_PASSWORD=match_password fastlane build'
```

### Downloading the .ipa file

This is a quick and easy step:

```bash
scp mac:~/reactnativetest/ios/reactnativetest.ipa .
```


### Installing the .ipa file

Plug in your phone, and grant the Linux computer permission to access it.  Then, simply run

```bash
ideviceinstaller -i reactnativetest.ipa
```

That's it, the app should be installed on the iOS device!
