#!/bin/sh


GITCONFIG="/root/.gitconfig"
STR_SEARCH="        directory = *"

if [ -f "/mnt/gitconfig" ]; then
  cp -f /mnt/gitconfig ~/.gitconfig
  git config --global core.autocrlf input
  git config --global --add safe.directory "*"
elif [ -f "/mnt/.gitconfig" ]; then
  cp -f /mnt/.gitconfig ~/.gitconfig
  git config --global core.autocrlf input
  git config --global --add safe.directory "*"
elif ! grep -q "$STR_SEARCH" "$GITCONFIG" ; then
  echo "[safe]" >> ~/.gitconfig
  echo "$STR_SEARCH" >> ~/.gitconfig
fi

if [ -d ~/.ssh ]; then
  if echo "$(mountpoint ~/.ssh)" | grep -q "is a mountpoint"; then
    # ~/.ssh is a bind mount from the host
    return 0;
  fi
  echo "$(/bin/ls -a /mnt/ssh 2>/dev/null)" > /tmp/ls_mnt_ssh
  echo "$(/bin/ls -a ~/.ssh 2>/dev/null)" > /tmp/ls_ssh
  echo "$(/bin/ls -a /tmp/.ssh 2>/dev/null)" > /tmp/ls_tmp_ssh
  if [ -d /mnt/ssh ] && [ -z "$(comm -3 /tmp/ls_mnt_ssh /tmp/ls_ssh)" ]; then
    # /mnt/ssh and ~/.ssh are the same in terms of file names.
    rm /tmp/ls_mnt_ssh
    rm /tmp/ls_ssh
    rm /tmp/ls_tmp_ssh
    return 0;
  fi
  if [ -d /tmp/.ssh ] && [ -z "$(comm -3 /tmp/ls_tmp_ssh /tmp/ls_ssh)" ]; then
    # Retro-compatibility: /tmp/.ssh and ~/.ssh are the same in terms of file names.
    rm /tmp/ls_mnt_ssh
    rm /tmp/ls_ssh
    rm /tmp/ls_tmp_ssh
    return 0;
  fi
  rm /tmp/ls_mnt_ssh
  rm /tmp/ls_ssh
  rm /tmp/ls_tmp_ssh
fi

if [ -d /tmp/.ssh ]; then
  # Retro-compatibility
  echo "Copying content of /tmp/.ssh to ~/.ssh"
  mkdir -p ~/.ssh
  cp -r /tmp/.ssh/* ~/.ssh/
  chmod 600 ~/.ssh/*
  chmod 644 ~/.ssh/*.pub &> /dev/null
  return 0
fi

if [ ! -d /mnt/ssh ]; then
  echo "No bind mounted ssh directory found (~/.ssh, /tmp/.ssh, /mnt/ssh), exiting"
  return 0
fi

if [ "$(stat -c '%U' /mnt/ssh)" != "UNKNOWN" ]; then
  echo "Unix host detected, symlinking /mnt/ssh to ~/.ssh"
  rm -r ~/.ssh
  ln -s /mnt/ssh ~/.ssh
  chmod 600 ~/.ssh/*
  chmod 644 ~/.ssh/*.pub &> /dev/null
  return 0
fi

echo "Windows host detected, copying content of /mnt/ssh to ~/.ssh"
mkdir -p ~/.ssh
cp -rf /mnt/ssh/* ~/.ssh/
chmod 600 ~/.ssh/*
chmod 644 ~/.ssh/*.pub &> /dev/null
