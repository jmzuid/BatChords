# BatChords
A plugin to help play and record musical chords with one hand using external MIDI devices

<!DOCTYPE html>
<html lang="en">

<h1 id="eecs485-getting-started">Running BatChords</h1>
credit: These instructions are from Andrew DeOrio's EECS 485 Project 3 Setup tutorial. We are using the same environment.

<p>This document will guide you through setting up your computer for local development on OSX or Linux, or through setting up a virtual machine if using Windows or another operating system.</p>

<p>For local development, clone or download the repo <code class="highlighter-rouge">git clone https://github.com/jmzuid/BatChords</code>.  Throughout this document, we’ll refer to this root project directory as <code class="highlighter-rouge">$PROJECT_ROOT</code>.</p>

<p>This tutorial will walk you through</p>
<ul>
  <li><a href="#restarting-this-tutorial">Restarting this tutorial</a></li>
  <li><a href="#install-toolchain">Install toolchain</a></li>
  <li><a href="#create-a-python-virtual-environment">Create a Python virtual environment</a></li>
  <br>
  <li><a href="#install-back-end">Install back end</a></li>
  <li><a href="#rest-api">REST API</a></li>
  <li><a href="#install-front-end">Install front end</a></li>
  <li><a href="#understanding-the-front-end-code">Understanding the front end code</a></li>
  <li><a href="#developer-tools">Developer Tools</a></li>
</ul>

<h2 id="restarting-this-tutorial">Restarting this tutorial</h2>
<p>If you made a mistake with these Python instructions, here’s how to start over.  First, close your shell and reopen it to ensure that environment variables are reset.  Then, delete the virtual environment.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">cd</span> <span class="nv">$PROJECT_ROOT</span>
<span class="gp">$</span> rm <span class="nt">-rf</span> env
</code></pre></div></div>

<p>After you’ve deleted your virtual environment, you can create it again.  Resume the instructions with <a href="#create-a-python-virtual-environment">Create a Python virtual environment</a>.</p>

<h2 id="install-toolchain">Install toolchain</h2>
<p>Install the tools based on your operating system.</p>

<h3 id="osx">OSX</h3>
<p>If you run OSX, install the <a href="https://brew.sh/">Homebrew package manager</a>.  Then, use Homebrew to install a few packages like Python3.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> /usr/bin/ruby <span class="nt">-e</span> <span class="s2">"</span><span class="k">$(</span>curl <span class="nt">-fsSL</span> https://raw.githubusercontent.com/Homebrew/install/master/install<span class="k">)</span><span class="s2">"</span>
<span class="gp">$</span> brew install python3 git tree wget
</code></pre></div></div>

<h3 id="linux">Linux</h3>
<p>These instructions work for Debian-based systems like Ubuntu.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">sudo </span>apt-get update
<span class="gp">$</span> <span class="nb">sudo </span>apt-get install python3-venv python3-wheel python3-setuptools git tree
<span class="gp">$</span> <span class="nb">sudo </span>apt-get install default-jre
</code></pre></div></div>

<h3 id="linux-virtual-machine">Linux Virtual Machine</h3>
<p>If you are developing locally, you can skip this subsection and move on to <a href="#create-a-python-virtual-environment">Create a Python virtual environment</a>.</p>

<p>First, install <a href="https://git-scm.com/download/win">Git Bash</a>, <a href="https://www.vagrantup.com/downloads.html">Vagrant</a> and <a href="https://www.virtualbox.org/wiki/Downloads">VirtualBox</a>.  When we use the command line later in this section, we’re assuming that you are using Git Bash, not the Windows command prompt.</p>

<p>Vagrant lets us describe an entire virtual computer using a configuration file.  Usually, the configuration lives inside your project’s root directory.  Create a sample configuration file for an Ubuntu 16.04 virtual machine:</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">cd</span> <span class="nv">$PROJECT_ROOT</span>/
<span class="gp">$</span> vagrant init bento/ubuntu-16.04
<span class="go">A `Vagrantfile` has been placed in this directory. You are now
ready to `vagrant up` your first virtual environment! Please read
the comments in the Vagrantfile as well as documentation on
`vagrantup.com` for more information on using Vagrant.
</span><span class="gp">$</span> <span class="nb">ls </span>Vagrantfile
<span class="go">Vagrantfile
</span></code></pre></div></div>

<p>Now, edit the <code class="highlighter-rouge">Vagrantfile</code> to forward a port for your development webserver.  This lets you access a webserver running inside your guest virtual machine using a web browser running on your host operating system.  Find this line, uncomment it, and change the port numbers.</p>
<div class="language-ruby highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="n">config</span><span class="p">.</span><span class="nf">vm</span><span class="p">.</span><span class="nf">network</span> <span class="s2">"forwarded_port"</span><span class="p">,</span> <span class="ss">guest: </span><span class="mi">8000</span><span class="p">,</span> <span class="ss">host: </span><span class="mi">8000</span>
</code></pre></div></div>

<p>Before starting your virtual machine, make sure you don’t have any stale virtual machines <em>for this project</em> laying around.  You can also use the VirtualBox graphical user interface (GUI) for this.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> vboxmanage list vms
</code></pre></div></div>

<p>Start your virtual machine.  This is an entire second operating system running like it’s a program.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> vagrant up
<span class="go">Bringing machine 'default' up with 'virtualbox' provider...
</span></code></pre></div></div>

<p>Check if VM is running:</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> vagrant status
<span class="go">Current machine states:

default                   running (virtualbox)
</span></code></pre></div></div>

<p>Log in to your virtual machine using SSH</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> vagrant ssh
<span class="go">Welcome to Ubuntu 16.04.2 LTS (GNU/Linux 4.4.0-75-generic x86_64)

</span><span class="gp">vagrant@vagrant:~$</span>
</code></pre></div></div>

<p>All commands for the remainder of this tutorial are executed inside your virtual machine.  By default, there is a shared directory between the guest and host operating systems.  Inside the VM, it’s located at <code class="highlighter-rouge">/vagrant</code>.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">cd</span> /vagrant/
<span class="gp">$</span> <span class="nb">ls</span>
<span class="go">Vagrantfile
</span></code></pre></div></div>

<p>You can install programs with <code class="highlighter-rouge">apt-get</code>.  Let’s install a few tools that this tutorial will use later.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> apt-get update
<span class="gp">$</span> apt-get install python3-venv python3-wheel python3-setuptools git tree
<span class="gp">$</span> <span class="nb">sudo </span>apt-get install default-jre
</code></pre></div></div>

<p>Let’s fire up a development web server inside our VM.  This is a <em>static file server</em>.  It listens for requests, and responds to a request with a copy of a file from the server’s file system.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">cd</span> /vagrant
<span class="gp">$</span> python3 <span class="nt">-m</span> http.server 8000
<span class="go">Serving HTTP on 0.0.0.0 port 8000 ...
</span></code></pre></div></div>

<p>After starting the server, navigate to <a href="http://localhost:8000">http://localhost:8000</a> using a web browser on your host OS.  You should see something like this:</p>

<p><img src="https://eecs485staff.github.io/p1-insta485-static/images/dev-server.png" alt="dev server screenshot" /></p>

<p>After you’re done with a coding session, log out of your SSH session, and shut down the VM.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">vagrant@vagrant $</span> <span class="nb">exit</span>
<span class="gp">$</span> vagrant halt
<span class="gp">==&gt;</span> default: Attempting graceful shutdown of VM...
</code></pre></div></div>

<p><strong>WARNING</strong> This project uses <code class="highlighter-rouge">npm</code> to install JavaScript libraries, shared directories won’t work.  Use a  <code class="highlighter-rouge">$PROJECT_ROOT</code> that is inside the VM and <em>not</em> shared.  A good choice is <code class="highlighter-rouge">/home/vagrant</code>. </p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> vagrant ssh
<span class="gp">$</span> <span class="nb">cd</span> /home/vagrant/
<span class="gp">$</span> git clone https://github.com/jmzuid/BatChords
<span class="gp">$</span> <span class="nb">cd </span>BatChords
<span class="gp">$</span> <span class="nb">pwd</span>
<span class="gp">/home/vagrant/BatChords  #</span> this is your <span class="nv">$PROJECT_ROOT</span>
</code></pre></div></div>

<h2 id="create-a-python-virtual-environment">Create a Python virtual environment</h2>
<p>This section will help you install the Python tools and libraries locally, which won’t affect Python tools and libraries installed elsewhere on your computer.</p>

<p>After finishing this section, you’ll have a folder called <code class="highlighter-rouge">env/</code> that contains all the Python libraries you need for this project.  Those libraries won’t interfere with other Python projects on your computer.</p>

<p>We’re starting in the root of our project directory.  If you’re using a VM, don’t forget to <code class="highlighter-rouge">vagrant ssh</code>.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">cd</span> <span class="nv">$PROJECT_ROOT</span>
</code></pre></div></div>

<p>Set up a virtual environment.  (More on <a href="https://docs.python.org/3/library/venv.html">venv and the creation of virtual environments</a>)</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> python3 <span class="nt">-m</span> venv env
</code></pre></div></div>

<p><strong>NOTE</strong> If you’re on OSX and have previously installed Anaconda, be sure to use the full path to the Python executable.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> which python
<span class="go">/Users/awdeorio/anaconda/bin/python
</span><span class="gp">$</span> rm <span class="nt">-rf</span> env  <span class="c"># Remove environment from previous step and start over</span>
<span class="gp">$</span> /usr/local/bin/python3 <span class="nt">-m</span> venv env
</code></pre></div></div>

<p><strong>NOTE</strong> If the <code class="highlighter-rouge">PYTHONPATH</code> environment variable is set, then this can cause problems.  Check this when you first start a new shell.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">echo</span> <span class="nv">$PYTHONPATH</span>  <span class="c"># Output isn't blank, problem!</span>
<span class="go">/Users/awdeorio/anaconda/lib/
</span><span class="gp">$</span> rm <span class="nt">-rf</span> env  <span class="c"># Remove environment from previous step and start over</span>
<span class="gp">$</span> <span class="nb">unset </span>PYTHONPATH
<span class="gp">$</span> python3 <span class="nt">-m</span> venv env
</code></pre></div></div>

<p>Activate virtual environment.  You’ll need to do this every time you start a new shell.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">source </span>env/bin/activate
</code></pre></div></div>

<p>We now have a complete local environment for Python.  Everything lives in one directory.  Environment variables point to this virtual environment.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">echo</span> <span class="nv">$VIRTUAL_ENV</span>
<span class="go">/Users/carolinesaab/Documents/eecs/eecs498/BatChords/env
</span></code></pre></div></div>

<p>We have a Python interpreter installed inside the virtual environment.  <code class="highlighter-rouge">which python</code> tells you exactly which python executable file will be used when you type <code class="highlighter-rouge">python</code>.  Because we’re in a virtual environment, there’s more than one option!</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> which python
<span class="go">/Users/carolinesaab/Documents/eecs/eecs498/BatChords/env/bin/python
</span><span class="gp">$</span> which <span class="nt">-a</span> python  <span class="c"># Show all available python executables</span>
<span class="go">/Users/carolinesaab/Documents/eecs/eecs498/BatChords/env/bin/python
/usr/bin/python
</span></code></pre></div></div>

<p>There’s a package manager for Python installed in the virtual environment.  That will help us install Python libraries later.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> which pip
<span class="go">/Users/carolinesaab/Documents/eecs/eecs498/BatChords/env/bin/pip
</span><span class="gp">$</span> pip <span class="nt">--version</span>
<span class="gp">pip 9.0.1 from /Users/carolinesaab/Documents/eecs/eecs498/BatChords/env/lib/python3.6/site-packages (python 3.6)  #</span> Your version may be different
</code></pre></div></div>

<p>Python packages live in the virtual environment.  We can see that Python’s own tools are already installed (<code class="highlighter-rouge">pip</code> and <code class="highlighter-rouge">setuptools</code>).</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">ls </span>env/lib/python3.6/site-packages/
<span class="go">pip
setuptools
</span><span class="c">...
</span></code></pre></div></div>

<p>Upgrade the Python tools in your virtual environment</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> pip install <span class="nt">--upgrade</span> pip setuptools wheel
</code></pre></div></div>

<p>For developers: install HTML5 Validator to check style</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> pip install html5validator
<span class="gp">$</span> html5validator <span class="nt">--version</span>
<span class="gp">html5validator 0.2.6         #</span> Your version may be different
</code></pre></div></div>


<h2 id="install-back-end">Install back end</h2>

<p>Next, we’ll install the back end app in developer mode. Make sure that you still see <code>(env)</code> in the terminal, meaning your virtual environment is activated. Otherwise run <code>env/bin/activate</code> to reactivate it.</p>

<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code>
<span class="gp">$</span> pip install <span class="nt">-e</span> <span class="nb">.</span>
</code></pre></div></div>

<h2 id="install-front-end">Install front end</h2>

<p>We need to install a tool chain for our front end.</p>

<h3 id="install-javascript-virtual-environment">Install JavaScript virtual environment</h3>
<p>We’re working in the BatChords root directory, with the Python virtual environment activated.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">cd </span>batchords/
<span class="gp">$</span> <span class="nb">source </span>env/bin/activate
</code></pre></div></div>

<p>We want to install our front end tool chain into our existing virtual environment.  <code class="highlighter-rouge">nodeenv</code> is a Python tool for merging a Python virtual environment with a JavaScript virtual environment.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> pip install nodeenv # You may need to use pip3 if this command doesn't work
<span class="gp">$</span> nodeenv <span class="nt">--python-virtualenv</span>
<span class="gp">$</span> <span class="nb">source </span>env/bin/activate  <span class="c"># Yes, do this again after nodeenv</span>
</code></pre></div></div>

<h3 id="javascript-packages">JavaScript packages</h3>
<p>Next, we’ll create a JavaScript package for our front end source code, which lives in <code class="highlighter-rouge">batchords/js/</code>.

<p>Our front end JavaScript package will use the <code class="highlighter-rouge">react</code> library, which in turn relies on several dependencies of its own.  We’ll use <code class="highlighter-rouge">npm</code> to install these dependencies. At this point, you should be within the <code class="highlighter-rouge">BatChords</code> directory.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> npm install <span class="nb">.</span>
</code></pre></div></div>

<p>The source code for module dependencies is stored in <code class="highlighter-rouge">./node_modules/</code> and their exact versions are listed in <code class="highlighter-rouge">package-lock.json</code>.  This is what the root BatChords directory should look like now.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> <span class="nb">ls</span>
<span class="go">README.md    batchords.egg-info  env     package-lock.json setup.py
batchords   bin     node_modules    package.json    webpack.config.js
</span></code></pre></div></div>

<p>Now finally, run the front end build process.</p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span>  ./node_modules/.bin/webpack
[BABEL] Note: The code generator has deoptimised the styling of "/Users/carolinesaab/Documents/eecs/eecs498/BatChords/node_modules/react-dom/cjs/react-dom.development.js" as it exceeds the max of "500KB".
Hash: bb352a7038ce1b616a01
Version: webpack 3.6.0
Time: 17159ms
    Asset    Size  Chunks                    Chunk Names
bundle.js  799 kB       0  [emitted]  [big]  main
  [16] ./batchords/js/main.jsx 482 bytes {0} [built]
  [32] ./batchords/js/bcapp.jsx 2.47 kB {0} [built]
  [33] ./batchords/js/pad.jsx 2.89 kB {0} [built]
    + 31 hidden modules
</span><span class="gp">$</span> ./node_modules/.bin/webpack <span class="nt">--watch</span>  <span class="c"># optional, for auto rebuild during development</span>
</code></pre></div></div>

<p><code class="highlighter-rouge">bundle.js</code> is the output of our front end build process, a single JavaScript file that is completely self-contained with no dependencies, <code class="highlighter-rouge">batchords/static/js/bundle.js</code>.</p>

<p>Fire up your web server. </p>
<div class="language-console highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="gp">$</span> ./bin/batchordsrun
</code></pre></div></div>

<p>Finally, browse to <a href="http://localhost:8000/">http://localhost:8000/</a>, where you’ll see the BatChords web app.</p>



<h2 id="akai-preset">Load Akai Keyboard Preset</h2>

<p>In order to use the Akai Mini Mpk keyboard the Akai Mpk Mini Editor must be downloaded from the <a href="http://www.akaipro.com/products/keyboard-controllers/mpk-mini-mkii">Akai website under the tab downloads</a>. In the home directory there is a file "akai_batchords.mk2". <a href="http://www.akaipro.com/support/kb/articles/akai-pro-mpk-mini-mkii-how-to-use-the-editor"> Instructions on using the Akai editor</a> to load this preset onto the Akai, the program must be selected on the Akai keyboard after loading. Before loading the preset all programs that take MIDI input (which includes Chrome) should be closed, otherwise they will interfere with the Mpk Mini editor. </p> 

  </body>
</html>
