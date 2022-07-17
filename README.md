# hexing-azure-sql

git clone https://github.com/thiagopazBR/hexing-azure-sql.git

# for dev

docker build --target=builder -t hexing-azure-sql:dev .

# for production

docker build -t hexing-azure-sql .

# Running

docker run -it --rm \
-v log/:log/ \
-v /usr/share/zabbix/modules/files/content/:files/ \
hexing-azure-sql \
build/index.js \
--target "commissioning_report" \
--start_date 2022-07-30 \
--end_date 2022-07-31
