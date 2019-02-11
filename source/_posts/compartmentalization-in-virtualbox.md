---
title: Compartmentalization in Virtualbox
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  Learn the basics of compartmentalizing your digital life using VirtualBox and
  Ubuntu
date: 2019-02-11 12:42:54
tags:
---


Let's say you want to compartmentalize your digital life. How do you get started?

This tutorial will cover using Virtualbox to create containers, or qubes, which you can isolate your digital activities in.

We'll use Ubuntu as the Host and Guest for this tutorial, but in theory you can use any operating system you'd like.  You can obtain an Ubuntu ISO from the [Ubuntu downloads page](https://www.ubuntu.com/download/desktop).

## Installing Virtualbox

To install Virtualbox on Ubuntu, you can run `sudo apt install virtualbox`. After the command completes, you should have desktop launchers which you can use to launch the Virtualbox console.

## Creating a new virtual machine

Next, we can create a new virtual machine:

1. Launch the VirtualBox Manager
2. Click the New button
3. Name your VM "Ubuntu - Base", and select "Type: Linux" and "Version: Ubuntu (64-bit)"
4. Click "Expert Mode"
5. Allocate at least 4096MB of memory to have a smooth running VM
6. Select "Create a virtual hard disk now"
7. Click "Create"
8. Choose "Hard disk file type: VDI" and "Storage on physical hard disk: Dynamically allocated"
9. Click "Create"
10. Select your VM from the list and click "Start"
11. Select the Ubuntu ISO file you've downloaded and boot from the ISO
12. Follow the installation procedure to install your Ubuntu virtual machine

## Cloning the virtual machine

Now that we have a fresh installation, you'll want to clone your virtual machine:

1. Launch the VirtualBox Manager
2. Select "Ubuntu" from the list and click "Clone"

From the clone menu, let's create three clones:

- A "Full Clone" named "Ubuntu - Base (Backup)"
- A "Linked Clone" named "Ubuntu - Banking"
- A "Linked Clone" named "Ubuntu - Untrusted"

What are these clones for?

The __Full Clone "Ubuntu - Base (Backup)"__ is a full backup of the virtual machine. This is just in case you ever want a fresh install of Ubuntu. If you'd rather repeat the entire process above (downloading the ISO, installing, etc.) then you can skip this full clone and save the disk space.

The __Linked Clones__ are what you'll actually run. Both "Ubuntu - Banking" and "Ubuntu - Untrusted" are based on "Ubuntu - Base". They have their own virtual hard disks which only record the differences since they were cloned from "Ubuntu - Base". What's the advantage? They use much less disk space, but they are completely isolated.

## Living in Virtual Machines

Now that you've installed your containers, you should get used to living in virtual machines. Decide how you want to compartmentalize your digital life. Perform as few actions as possible on your host operating system, to prevent compromise.
