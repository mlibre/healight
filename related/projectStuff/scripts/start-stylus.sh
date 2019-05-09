cd public/stylesheet/stylus
dirs=$(find ./ -type d)
cd ..
for d in $dirs;
do
	SPath=stylus/$d/
	DPath=css/$d/
	stylus -c -w $SPath --out $DPath &
done
