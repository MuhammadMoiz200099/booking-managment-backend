
class HelperService {
    tranformMeData(user, token) {
        return {
            id: user?._id,
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName,
            username: user?.username,
            phone: user?.phone,
            accessToken: token,
            profilePicture: user?.profilePicture,
            date: user?.date
        };
    }
}

module.exports = new HelperService();
