## Contributing

First off, thank you for considering contributing to `dir-uploader` module. It's people
like you that make this plugin such a great tool.

### Where do I go from here?

If you've noticed a bug or have a question, search the [issue tracker] first to see if
someone else in the community has already addressed the issue. If not, go ahead and
[make one][new issue]!

### Fork & create a branch

If this is something you think you can fix, then [fork dir-uploader module][] and
create a branch with a descriptive name.

A good branch name would be (where you're working on issue #123):

```sh
git checkout -b 123-add-new-functions
```

### Get the test suite running
This module includes a tests folder that contains a simple node test app, unit tests and end to end(e2e) tests. The tests runner is mocha (https://mochajs.org/). To run the tests 
1. Firstly, install all the dependencies by `npm install`.
2. It is easier to run when you install mocha as a global dependency `npm i -g mocha`
3. Start the node test app `node tests/testapp/server.js` (tested on node v10).
4. Run the tests `mocha tests/runTests.js`

### Did you find a bug?
* **Ensure the bug was not already reported** by searching the [issue tracker].

* If you're unable to find an open issue addressing the problem,
  [open a new one][new issue]. Be sure to include a **title and clear
  description**, as much relevant information as possible, and a **code sample**
  or an **executable test case** demonstrating the expected behavior that is not
  occurring.

### Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help;
everyone is a beginner at first.

### Make a Pull Request

At this point, you should switch back to your master branch and make sure it's
up to date with `dir-uploader` master branch:

```sh
git remote add upstream git@github.com:philips-software/dir-uploader.git 
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 123-add-new-functions
git rebase master
git push --set-upstream origin 123-add-new-functions
```

### Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code
has changed, and that you need to update your branch so it's easier to merge.

There's a lot of good resources out there but here's the suggested workflow:

```sh
git checkout 123-add-new-functions
git pull --rebase upstream master
git push --force-with-lease 123-add-new-functions
```

### Merging a PR (maintainers only)

A PR can only be merged into master by a maintainer if:

* It has been approved by at least two maintainers. If it was a maintainer who
  opened the PR, only one extra approval is needed.
* It has no requested changes.
* It is up to date with current master.

Any maintainer is allowed to merge a PR if all of these conditions are
met.

### Shipping a release (maintainers only)

Maintainers need to do the following to push out a release:

* Make sure all pull requests are in and that changelog is current
* If it's not a patch level release, create a stable branch for that release,
  otherwise switch to the stable branch corresponding to the patch release you
  want to ship:

```bash
git checkout master
git fetch 'reponame'
git rebase 'reponame'/master
# If the release is 2.1.x then this should be: 2-1-stable
git checkout -b N-N-stable
git push 'reponame' N-N-stable:N-N-stable
```

[issue tracker]: https://github.com/philips-software/dir-uploader/issues
[new issue]: https://github.com/philips-software/dir-uploader/issues/new
[fork dir-uploader module]: https://help.github.com/articles/fork-a-repo
[interactive rebase]: https://help.github.com/articles/interactive-rebase
