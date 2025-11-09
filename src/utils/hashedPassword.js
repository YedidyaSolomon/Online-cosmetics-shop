import bcrypt from 'bcrypt'

const round = 12;

export const hashPassword = async (plainPassword)=>{
    try{
        const hashedPassword = await bcrypt.hash(plainPassword, round)
        console.log('Password hashed successfully');
        return hashedPassword;
    }catch(error){
         console.error(' Hashing failed:', error.message);
        throw new Error ("hash is not successful", error.message)
    }
   
};

export const comparePassword = async (password, hashedPassword)=>{
    try{
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }catch(error){
        console.error('password comparison failed:', error.message);
    }
}


