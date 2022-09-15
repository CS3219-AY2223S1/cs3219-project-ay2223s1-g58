#!/bin/sh
set -e           # Stop on any error
npx sequelize-cli db:migrate --env production
npx sequelize-cli db:seed:all --env production 
exec "$@"        # Run the command as the main container process