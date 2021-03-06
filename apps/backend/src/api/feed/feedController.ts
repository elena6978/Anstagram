import { getSignedUrl } from '../../libs/gcpFileManagement';
import { Comment } from '../comment/commentModel';
import { Feed } from './feedModel';

const getUserFeed = async (req: any, res: any) => {
    try {
        let feed: any;
        const userFeed: any[] = [];
        const feedItemsToSkip: number = Number(req.params.feedItemsToSkip);
        if (feedItemsToSkip > 0) {
            feed = await Feed.find({}).sort({ createdAt: 'desc' }).skip(feedItemsToSkip).limit(10).populate({ path: 'user', select: 'firstName lastName username' });
        } else {
            feed = await Feed.find({}).sort({ createdAt: 'desc' }).limit(10).populate({ path: 'user', select: 'firstName lastName username' });
        }

        if (feed && feed.length) {
            for (const item of feed) {
                // Media
                const signedMedia = [];
                for (const privateMedia of item.media) {
                    const signedUrl = await getSignedUrl(privateMedia);
                    signedMedia.push(signedUrl);
                }

                // Feed Comments
                const feedComments = await Comment.find({ feed: item._id }).sort({ createdAt: 'desc' }).limit(2).populate({ path: 'user', select: 'firstName lastName username' });

                const newItem: any = { ...item._doc, media: signedMedia, feedComments };
                userFeed.push(newItem);
            }
        }
        res.json(userFeed);
    } catch (error) {
        res.status(400).json({ error: error.name, message: error.message });
        throw error;
    }
};

const addUserFeed = async (req: any, res: any) => {
    try {
        if (req.body.media && req.body.media.length) {
            const feed = new Feed({
                user: req.user.user,
                media: req.body.media,
                description: req.body.description,
                location: req.body.location
            });
            await feed.save();
            res.status(201).json({ message: `feed created successfully` });
        } else {
            res.status(400).json({ error: `no media found in post` });
        }
    } catch (error) {
        res.status(400).json({ error: error.name, message: error.message });
        throw error;
    }
};

export { getUserFeed, addUserFeed };
