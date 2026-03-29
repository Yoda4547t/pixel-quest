import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthStore, UserProfile } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export function useAuth() {
    const { setUser, setProfile, setLoading } = useAuthStore();

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    // Fetch or create user profile in Firestore
                    const userRef = doc(db, 'users', firebaseUser.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        
                        // Safe Migration Merge: Fills in any missing fields for older accounts
                        const mergedProfile: UserProfile = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email, // Force auth-email prioritization
                            username: data.username,
                            level: data.level || 1,
                            currentXP: data.currentXP || 0,
                            totalXP: data.totalXP || 0,
                            streakDays: data.streakDays || 0,
                            lastActiveDate: data.lastActiveDate || new Date().toISOString(),
                            unlockedAreas: data.unlockedAreas || ['Town'],
                            achievements: data.achievements || [],
                            coins: data.coins || 0,
                            avatarColor: data.avatarColor || 'default',
                            unlockedColors: data.unlockedColors || ['default'],
                            stats: data.stats || { strength: 5, intelligence: 5, focus: 5, resilience: 5 },
                            equipment: data.equipment || { weapon: null, armor: null, accessory: null },
                            unlockedEquipment: data.unlockedEquipment || [],
                            abilities: data.abilities || [],
                            playerBase: data.playerBase || { level: 1, buildings: {} },
                            activePet: data.activePet || null,
                            unlockedPets: data.unlockedPets || []
                        };
                        
                        setProfile(mergedProfile);
                    } else {
                        // Initialize new user
                        const newUserProfile: UserProfile = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            level: 1,
                            currentXP: 0,
                            totalXP: 0,
                            streakDays: 0,
                            lastActiveDate: new Date().toISOString(),
                            unlockedAreas: ['Town'],
                            achievements: [],
                            coins: 0,
                            avatarColor: 'default',
                            unlockedColors: ['default'],
                            stats: { strength: 5, intelligence: 5, focus: 5, resilience: 5 },
                            equipment: { weapon: null, armor: null, accessory: null },
                            unlockedEquipment: [],
                            abilities: [],
                            playerBase: { level: 1, buildings: {} },
                            activePet: null,
                            unlockedPets: []
                        };
                        await setDoc(userRef, newUserProfile);
                        setProfile(newUserProfile);
                    }
                } catch (error: any) {
                    console.error("Firestore Sync Error:", error);
                    // Native toast trigger from external package if available, else just gracefully log out
                    toast.error(`Firebase DB Error: ${error?.message || "Connection blocked!"}`, { duration: 10000 });
                    auth.signOut(); 
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, setProfile, setLoading]);
}
