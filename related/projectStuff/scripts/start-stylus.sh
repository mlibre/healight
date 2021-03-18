cd public/stylesheet/stylus
dirs=$(find ./ -type d)
cd .. # public/stylesheet/
for d in $dirs;
do
	SPath=stylus/$d/
	DPath=css/$d/
	stylus -c -w $SPath --out $DPath &
done

cd .. # public/
cd modules
dirs=$(find ./ -type d)
for d in $dirs;
do
	SPath=$d/
	DPath=$d/
	stylus -c -w $SPath --out $DPath &
done
