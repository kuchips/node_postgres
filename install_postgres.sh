#!/bin/bash

#update local packages 
brew update

#Grant necessary accesses to the user
sudo chown -R $(whoami) /usr/local/share/man/man7
chmod u+w /usr/local/share/man/man7

#install postgres
brew install postgres

#create symbolic links & aliases to the postgres files
ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
alias pg_start="launchctl load ~/Library/LaunchAgents"
alias pg_stop="launchctl unload ~/Library/LaunchAgents"

launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
brew services start postgresql

#Create a database
createdb 'posts_db'

#Create a user
createuser -s postgres

#Set the database variable
database="posts_db"
 
psql -d $database -U postgres -c "CREATE TABLE IF NOT EXISTS posts(post_id serial PRIMARY KEY, customer_id INTEGER NOT NULL, post_msg VARCHAR(400) NOT NULL, post_status CHAR(1) NOT NULL, post_type VARCHAR(10) NOT NULL, media_url VARCHAR(100),added_ts TIMESTAMP NOT NULL)"
psql -d $database -U postgres -c "INSERT INTO posts(customer_id,post_msg,post_status,post_type,media_url,added_as) VALUES (12345,'Hi there!','A','Post','www.google.com',current_timestamp)"
psql -d $database -U postgres -c "SELECT * FROM posts"
 
#Assign table count to variable
TableCount=$(psql -d $database -t -c "select count(1) from posts")
 
#Print the value of variable
echo "Total table records count....:"$TableCount

